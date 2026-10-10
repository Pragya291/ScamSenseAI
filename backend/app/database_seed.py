from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models import User, ScamReport, ReportComment, Blacklist, Whitelist, ScanHistory

def seed_database(db: Session):
    # 1. Create default admin and user accounts
    if not db.query(User).filter(User.email == "admin@scamsense.ai").first():
        admin_user = User(
            email="admin@scamsense.ai",
            hashed_password=get_password_hash("admin123"),
            full_name="ScamSense Security Admin",
            role="admin",
            is_active=True,
            is_verified=True
        )
        db.add(admin_user)

    if not db.query(User).filter(User.email == "user@scamsense.ai").first():
        demo_user = User(
            email="user@scamsense.ai",
            hashed_password=get_password_hash("user123"),
            full_name="Demo User",
            role="user",
            is_active=True,
            is_verified=True
        )
        db.add(demo_user)

    db.commit()

    # 2. Seed Whitelist
    whitelists_data = [
        {"entity_type": "domain", "entity_value": "paypal.com", "organization_name": "PayPal Inc."},
        {"entity_type": "domain", "entity_value": "google.com", "organization_name": "Google LLC"},
        {"entity_type": "domain", "entity_value": "apple.com", "organization_name": "Apple Inc."},
        {"entity_type": "domain", "entity_value": "amazon.com", "organization_name": "Amazon Services"},
        {"entity_type": "domain", "entity_value": "chase.com", "organization_name": "JPMorgan Chase & Co."},
        {"entity_type": "domain", "entity_value": "bankofamerica.com", "organization_name": "Bank of America Corp."},
        {"entity_type": "domain", "entity_value": "microsoft.com", "organization_name": "Microsoft Corp."},
        {"entity_type": "domain", "entity_value": "binance.com", "organization_name": "Binance Holdings"},
        {"entity_type": "domain", "entity_value": "coinbase.com", "organization_name": "Coinbase Global"}
    ]

    for item in whitelists_data:
        if not db.query(Whitelist).filter(Whitelist.entity_value == item["entity_value"]).first():
            db.add(Whitelist(**item))

    # 3. Seed Blacklist
    blacklists_data = [
        {
            "entity_type": "domain",
            "entity_value": "paypal-account-security-update.top",
            "reason": "Phishing site imitating PayPal login page to steal credit credentials",
            "risk_score": 98.0,
            "source": "threat_intel"
        },
        {
            "entity_type": "domain",
            "entity_value": "chase-verify-banking.xyz",
            "reason": "Fake banking portal designed for credential harvesting",
            "risk_score": 95.0,
            "source": "threat_intel"
        },
        {
            "entity_type": "phone",
            "entity_value": "+19005550199",
            "reason": "Impersonating IRS tax auditor demanding gift card payments",
            "risk_score": 92.0,
            "source": "community"
        },
        {
            "entity_type": "crypto_wallet",
            "entity_value": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            "reason": "Known wallet address tied to Telegram investment scam",
            "risk_score": 99.0,
            "source": "threat_intel"
        },
        {
            "entity_type": "email",
            "entity_value": "security-support@account-verification-alert.online",
            "reason": "Spoofed email domain sending fake account suspension warnings",
            "risk_score": 90.0,
            "source": "community"
        }
    ]

    for item in blacklists_data:
        if not db.query(Blacklist).filter(Blacklist.entity_value == item["entity_value"]).first():
            db.add(Blacklist(**item))

    db.commit()

    # 4. Seed Scam Reports
    if db.query(ScamReport).count() == 0:
        reports_data = [
            {
                "title": "Fake PayPal Account Suspension SMS with Malicious Link",
                "scam_type": "sms",
                "scam_category": "smishing",
                "description": "Received SMS claiming: 'PayPal Alert: Your account is suspended due to illegal access. Verify now at http://paypal-account-security-update.top or your account will be deleted in 24 hours.'",
                "sender_info": "paypal-account-security-update.top",
                "risk_score": 96.0,
                "verdict": "CRITICAL_SCAM",
                "status": "verified",
                "upvotes": 42,
                "downvotes": 1,
                "views_count": 340,
                "indicators": [
                    {"category": "Urgency", "severity": "HIGH", "rule_name": "high_risk_keyword", "description": "Demands immediate action within 24 hours"},
                    {"category": "Domain Typosquatting", "severity": "CRITICAL", "rule_name": "brand_typosquatting", "description": "Uses fake PayPal domain with .top extension"}
                ]
            },
            {
                "title": "IRS Phone Scam demanding payment in Apple Gift Cards",
                "scam_type": "phone",
                "scam_category": "vishing",
                "description": "Caller claimed to be an officer from the IRS with warrant number #99281. They threatened immediate arrest unless I bought $500 in Target / Apple gift cards and read the codes over phone.",
                "sender_info": "+19005550199",
                "risk_score": 92.0,
                "verdict": "CRITICAL_SCAM",
                "status": "verified",
                "upvotes": 28,
                "downvotes": 0,
                "views_count": 215,
                "indicators": [
                    {"category": "Impersonation", "severity": "CRITICAL", "rule_name": "government_impersonation", "description": "IRS never calls demanding gift card payments"}
                ]
            },
            {
                "title": "Telegram Crypto Double Investment Opportunity",
                "scam_type": "text",
                "scam_category": "crypto",
                "description": "Promised 200% return on Ethereum in 2 hours if sent to address 0x71C7656EC7ab88b098defB751B7401B5f6d8976F. Sent 0.1 ETH and got blocked immediately on Telegram.",
                "sender_info": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
                "risk_score": 99.0,
                "verdict": "CRITICAL_SCAM",
                "status": "verified",
                "upvotes": 55,
                "downvotes": 2,
                "views_count": 510,
                "indicators": [
                    {"category": "Financial Fraud", "severity": "CRITICAL", "rule_name": "crypto_double_scam", "description": "Classic crypto double multiplier scam"}
                ]
            }
        ]

        for rep in reports_data:
            report_obj = ScamReport(**rep)
            db.add(report_obj)
        db.commit()

        # Add comment to first report
        r1 = db.query(ScamReport).first()
        if r1:
            comment = ReportComment(
                report_id=r1.id,
                author_name="Security Analyst Mark",
                comment_text="Verified domain. IP resolves to known bulletproof hosting provider in Western Europe. Block immediately."
            )
            db.add(comment)
            db.commit()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    print("Database seeded successfully!")
