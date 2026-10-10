import logging
from typing import Dict, Any, List, Optional
import firebase_admin
from firebase_admin import credentials, auth, firestore
from app.core.config import settings

logger = logging.getLogger("scamsense.firebase")

class FirebaseService:
    def __init__(self):
        self.is_initialized = False
        self.db = None

        if settings.FIREBASE_PROJECT_ID:
            try:
                if not firebase_admin._apps:
                    if settings.FIREBASE_CREDENTIALS_PATH:
                        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                        firebase_admin.initialize_app(cred)
                    else:
                        # Initialize with default application credentials or project ID
                        firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
                
                self.db = firestore.client()
                self.is_initialized = True
                logger.info(f"Firebase Admin SDK initialized for project '{settings.FIREBASE_PROJECT_ID}'.")
            except Exception as e:
                logger.warning(f"Could not initialize Firebase Admin SDK: {e}. Falling back to SQLite database.")
                self.is_initialized = False

    def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase Auth ID Token securely."""
        if not self.is_initialized:
            return None
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            logger.error(f"Firebase ID Token verification failed: {e}")
            return None

    def save_scan_record(self, uid: str, scan_data: Dict[str, Any]) -> Optional[str]:
        """Save user scan history to Cloud Firestore under users/{uid}/scans."""
        if not self.is_initialized or not self.db or not uid:
            return None
        try:
            doc_ref = self.db.collection("users").document(uid).collection("scans").document()
            scan_data["id"] = doc_ref.id
            doc_ref.set(scan_data)
            return doc_ref.id
        except Exception as e:
            logger.error(f"Failed to save scan record to Firestore: {e}")
            return None

    def get_user_scan_history(self, uid: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve authenticated user's scan records from Cloud Firestore."""
        if not self.is_initialized or not self.db or not uid:
            return []
        try:
            scans_ref = self.db.collection("users").document(uid).collection("scans")
            query = scans_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.stream()
            records = []
            for doc in docs:
                data = doc.to_dict()
                data["id"] = doc.id
                records.append(data)
            return records
        except Exception as e:
            logger.error(f"Failed to fetch scan history from Firestore: {e}")
            return []

    def delete_scan_record(self, uid: str, scan_id: str) -> bool:
        """Delete specific scan record owned by authenticated user in Firestore."""
        if not self.is_initialized or not self.db or not uid or not scan_id:
            return False
        try:
            doc_ref = self.db.collection("users").document(uid).collection("scans").document(scan_id)
            doc_ref.delete()
            return True
        except Exception as e:
            logger.error(f"Failed to delete scan record '{scan_id}' from Firestore: {e}")
            return False
