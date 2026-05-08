import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY", "")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
CONTACT_RECIPIENT_EMAIL = os.getenv("CONTACT_RECIPIENT_EMAIL", SMTP_FROM)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://riego-automatizado-mobile-web.vercel.app")

DB_HOST = os.getenv("DB_HOST", "")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "")
