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
    def get_by_id(user_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, nombre, email, rol, created_at FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        return user
    
    @staticmethod
    def get_all():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, nombre, email, rol, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return users
    
    @staticmethod
    def update(user_id, nombre, email):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE users SET nombre = %s, email = %s WHERE id = %s",
            (nombre, email, user_id)
        )

        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        conn.close()

        return affected > 0
    
    @staticmethod
    def update_rol(user_id, rol):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE users SET rol = %s WHERE id = %s",
            (rol, user_id)
        )

        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        conn.close()

        return affected > 0
    
    @staticmethod
    def delete(user_id):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))

        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        conn.close()

        return affected > 0

    @staticmethod
    def verify_password(password, password_hash):
        return check_password_hash(password_hash, password)
