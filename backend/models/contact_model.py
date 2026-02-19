from database import get_db_connection
from datetime import datetime, timedelta
class ContactMessage:
    
    @staticmethod
    def create(nombre, email, asunto, mensaje):
        """Crear nuevo mensaje de contacto"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO contact_messages (nombre, email, asunto, mensaje)
            VALUES (%s, %s, %s, %s)
        """
        
        cursor.execute(query, (nombre, email, asunto, mensaje))
        conn.commit()
        
        message_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return message_id
    
    @staticmethod
    def get_all():
        """Obtener todos los mensajes ordenados por fecha (más recientes primero)"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT id, nombre, email, asunto, mensaje, leido, created_at
            FROM contact_messages
            ORDER BY created_at DESC
        """
        
        cursor.execute(query)
        messages = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return messages
    
    @staticmethod
    def get_by_id(message_id):
        """Obtener mensaje específico por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT id, nombre, email, asunto, mensaje, leido, created_at
            FROM contact_messages
            WHERE id = %s
        """
        
        cursor.execute(query, (message_id,))
        message = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return message
    
    @staticmethod
    def mark_as_read(message_id):
        """Marcar mensaje como leído"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "UPDATE contact_messages SET leido = TRUE WHERE id = %s"
        cursor.execute(query, (message_id,))
        conn.commit()
        
        affected = cursor.rowcount
        cursor.close()
        conn.close()
        
        return affected > 0
    
    @staticmethod
    def mark_as_unread(message_id):
        """Marcar mensaje como no leído"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "UPDATE contact_messages SET leido = FALSE WHERE id = %s"
        cursor.execute(query, (message_id,))
        conn.commit()
        
        affected = cursor.rowcount
        cursor.close()
        conn.close()
        
        return affected > 0
    
    @staticmethod
    def delete(message_id):
        """Eliminar mensaje por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "DELETE FROM contact_messages WHERE id = %s"
        cursor.execute(query, (message_id,))
        conn.commit()
        
        affected = cursor.rowcount
        cursor.close()
        conn.close()
        
        return affected > 0
    
    @staticmethod
    def get_unread_count():
        """Obtener cantidad de mensajes no leídos (para el badge rojo)"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT COUNT(*) as count FROM contact_messages WHERE leido = FALSE"
        cursor.execute(query)
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return result['count'] if result else 0
    
    @staticmethod
    def delete_old_messages(days=15):
        """Eliminar mensajes más antiguos que X días (auto-limpieza)"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        query = "DELETE FROM contact_messages WHERE created_at < %s"
        cursor.execute(query, (cutoff_date,))
        conn.commit()
        
        deleted_count = cursor.rowcount
        cursor.close()
        conn.close()
        
        return deleted_count