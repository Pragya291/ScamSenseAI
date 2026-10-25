from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None, role: str = "user") -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    api_key: Optional[str] = Depends(api_key_header),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    from app.models.api_key import ApiKey

    # Check API key first if provided
    if api_key:
        api_key_obj = db.query(ApiKey).filter(ApiKey.key == api_key, ApiKey.is_active == True).first()
        if api_key_obj:
            user = db.query(User).filter(User.id == api_key_obj.user_id, User.is_active == True).first()
            if user:
                return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )

    # Check JWT Token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Bearer token or X-API-Key header required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = None
    role = "user"
    firebase_uid = None
    firebase_email = None
    firebase_name = None

    # Check for demo or local bypass tokens
    if token and (token.startswith("demo-") or token.startswith("google-demo-") or token.startswith("mock-")):
        import re
        clean_suffix = re.sub(r'[^a-zA-Z0-9]', '', token)
        token_suffix = clean_suffix[-24:]
        demo_email = f"demo_{token_suffix}@scamsense.internal"
        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            user = User(
                email=demo_email,
                full_name=f"Guest User {token_suffix[:6]}",
                hashed_password="mock_authenticated_session",
                role="user",
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role", "user")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        # Fallback to Firebase Token verification
        from app.services.firebase_service import FirebaseService
        fb_svc = FirebaseService()
        if fb_svc.is_initialized:
            fb_token = fb_svc.verify_token(token)
            if fb_token:
                firebase_uid = fb_token.get("uid")
                firebase_email = fb_token.get("email") or f"{firebase_uid}@scamsense.internal"
                firebase_name = fb_token.get("name") or (firebase_email.split("@")[0] if "@" in firebase_email else "User")
                user_id = firebase_email
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user = None
    try:
        uid_int = int(user_id)
        user = db.query(User).filter(User.id == uid_int, User.is_active == True).first()
    except (ValueError, TypeError):
        user = db.query(User).filter(User.email == str(user_id), User.is_active == True).first()

    # Auto-provision verified Firebase user in SQLite if not yet existing
    if not user and firebase_uid:
        user = db.query(User).filter(User.email == firebase_email).first()
        if not user:
            user = User(
                email=firebase_email,
                full_name=firebase_name,
                hashed_password="firebase_authenticated_account",
                role="user",
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    if firebase_uid:
        user.firebase_uid = firebase_uid

    return user

def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    api_key: Optional[str] = Depends(api_key_header),
    db: Session = Depends(get_db)
):
    try:
        return get_current_user(token=token, api_key=api_key, db=db)
    except HTTPException:
        return None

def get_current_admin_user(
    current_user = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation requires administrator privileges"
        )
    return current_user
