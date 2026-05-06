import os

JWT_SECRET_KEY = "$2b$12$76R3E4p.Y6iO1P7vRkX1e.G7M9z7H8B9C0D1E2F3G4H5I6J7K8L9M"
GOOGLE_MAPS_API_KEY = "AIzaSyBtY3CFsOFZlT8o58nOt54GosK0npZ1d8M"

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://riego-automatizado-mobile-web.vercel.app")

# Credenciales Aiven
DB_HOST = "mysql-91a4811-jorg-cfd0.l.aivencloud.com"
DB_PORT = 11416
DB_USER = "avnadmin"
DB_PASSWORD = "AVNS_xFw4DeDiUE77D7LZ3Lb"
DB_NAME = "huertosmart_db"
