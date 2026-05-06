from datetime import datetime, timedelta, timezone

from database import get_db_connection
from werkzeug.security import check_password_hash, generate_password_hash


class LoginVerification:
    @staticmethod
    def ensure_table():
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS login_verification_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(128) NOT NULL UNIQUE,
                user_id INT NOT NULL,
                code_hash VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                used_at DATETIME NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_login_codes_session (session_id),
                INDEX idx_login_codes_user (user_id),
                CONSTRAINT fk_login_codes_user
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
            )
            """
        )

        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def create(session_id, user_id, code, ttl_minutes=10):
        LoginVerification.ensure_table()
        conn = get_db_connection()
        cursor = conn.cursor()

        expires_at = datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes)
        cursor.execute(
            """
            INSERT INTO login_verification_codes
                (session_id, user_id, code_hash, expires_at)
            VALUES (%s, %s, %s, %s)
            """,
            (
                session_id,
                user_id,
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
            SELECT lvc.*, u.rol
            FROM login_verification_codes lvc
            JOIN users u ON u.id = lvc.user_id
            WHERE lvc.session_id = %s
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
            "UPDATE login_verification_codes SET used_at = %s WHERE id = %s",
            (now, record["id"]),
        )
        conn.commit()

        cursor.close()
        conn.close()

        return {"user_id": record["user_id"], "rol": record["rol"]}
