from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection

class User:
    
    @staticmethod
    def create(nombre, email, password):
        conn = get_db_connection()
        cursor = conn.cursor()

        hashed_password = generate_password_hash(password)

        cursor.execute(
            "INSERT INTO users (nombre, email, password_hash) VALUES (%s, %s, %s)",
            (nombre, email, hashed_password)
        )

        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def get_by_email(email):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        return user

    @staticmethod
    def verify_password(password, password_hash):
        return check_password_hash(password_hash, password)
