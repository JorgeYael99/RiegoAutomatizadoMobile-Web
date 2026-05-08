from datetime import datetime, timedelta, timezone

from database import get_db_connection
from werkzeug.security import check_password_hash, generate_password_hash


class RegistrationVerification:
    @staticmethod
    def ensure_table():
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS registration_verification_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(128) NOT NULL UNIQUE,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                code_hash VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                used_at DATETIME NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_registration_codes_session (session_id),
                INDEX idx_registration_codes_email (email)
            )
            """
        )

        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def create(session_id, nombre, email, password_hash, code, ttl_minutes=30):
        RegistrationVerification.ensure_table()
        conn = get_db_connection()
        cursor = conn.cursor()

        expires_at = datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes)
        cursor.execute(
            """
            INSERT INTO registration_verification_codes
                (session_id, nombre, email, password_hash, code_hash, expires_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                session_id,
                nombre,
                email,
                password_hash,
                generate_password_hash(code),
                expires_at.replace(tzinfo=None),
            ),
        )

        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def verify(session_id, code):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM registration_verification_codes
            WHERE session_id = %s
            """,
            (session_id,),
        )
        record = cursor.fetchone()

        if not record or record["used_at"]:
            cursor.close()
            conn.close()
            return None

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if record["expires_at"] < now:
            cursor.close()
            conn.close()
            return None

        if not check_password_hash(record["code_hash"], code):
            cursor.close()
            conn.close()
            return None

        cursor.execute(
            "UPDATE registration_verification_codes SET used_at = %s WHERE id = %s",
            (now, record["id"]),
        )
        conn.commit()

        cursor.close()
        conn.close()

        return {
            "nombre": record["nombre"],
            "email": record["email"],
            "password_hash": record["password_hash"],
        }
