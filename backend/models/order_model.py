from database import get_db_connection

class Order:
    
    @staticmethod
    def get_all():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT o.id, o.user_id, o.total, o.estado, o.created_at,
                   u.nombre as usuario_nombre, u.email as usuario_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        """

        cursor.execute(query)
        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return orders
    
    @staticmethod
    def get_by_id(order_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT o.id, o.user_id, o.total, o.estado, o.created_at,
                   u.nombre as usuario_nombre, u.email as usuario_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = %s
        """

        cursor.execute(query, (order_id,))
        order = cursor.fetchone()

        cursor.close()
        conn.close()

        return order
    
    @staticmethod
    def get_order_items(order_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT oi.id, oi.cantidad, oi.precio_unitario,
                   p.nombre as producto_nombre, p.imagen_url
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = %s
        """

        cursor.execute(query, (order_id,))
        items = cursor.fetchall()

        cursor.close()
        conn.close()

        return items
    
    @staticmethod
    def get_stats():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query_total = "SELECT COALESCE(SUM(total), 0) as total_ingresos, COUNT(*) as total_pedidos FROM orders WHERE estado = 'pagado'"
        cursor.execute(query_total)
        total_stats = cursor.fetchone()

        query_estados = """
            SELECT estado, COUNT(*) as count 
            FROM orders 
            GROUP BY estado
        """
        cursor.execute(query_estados)
        estados = cursor.fetchall()

        query_top_products = """
            SELECT p.nombre, SUM(oi.cantidad) as total_vendido
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.estado = 'pagado'
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
        """
        cursor.execute(query_top_products)
        top_products = cursor.fetchall()

        query_ventas_diarias = """
            SELECT DATE(created_at) as fecha, SUM(total) as ingresos, COUNT(*) as pedidos
            FROM orders
            WHERE estado = 'pagado' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY fecha ASC
        """
        cursor.execute(query_ventas_diarias)
        ventas_diarias = cursor.fetchall()

        cursor.close()
        conn.close()

        return {
            "total_ingresos": float(total_stats["total_ingresos"]) if total_stats["total_ingresos"] else 0,
            "total_pedidos": total_stats["total_pedidos"] or 0,
            "estados": estados,
            "top_products": top_products,
            "ventas_diarias": ventas_diarias
        }
    
    @staticmethod
    def get_all_for_export():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT o.id, u.nombre as cliente, u.email, o.total, o.estado, o.created_at
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        """

        cursor.execute(query)
        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return orders
