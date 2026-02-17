from flask import Blueprint, request, jsonify
from database import get_db_connection
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

product_bp = Blueprint("products", __name__)


# 🔹 Obtener todos los productos
@product_bp.route("", methods=["GET"])
def get_products():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()

        return jsonify(products), 200

    except Exception as e:
        print(" ERROR GET PRODUCTS:", e)
        return jsonify({"error": "Error obteniendo productos"}), 500

    finally:
        # Esto se ejecuta SIEMPRE, haya error o no, garantizando que se cierre la conexión
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# 🔹 Crear producto (solo admin)
@product_bp.route("", methods=["POST"])
@jwt_required()
def create_product():
    print("IDENTITY:", get_jwt_identity())
    print("CLAIMS:", get_jwt())

    try:
        claims = get_jwt()

        #  Verificar rol
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403

        #  Obtener JSON seguro
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"error": "JSON inválido o vacío"}), 400

        print(" DATA RECIBIDA:", data)

        #  Validar campos obligatorios
        required_fields = ["name", "description", "price", "stock", "image"]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo: {field}"}), 400

        #  Cnversión segura de tipos
        try:
            name = str(data["name"]).strip()
            description = str(data["description"]).strip()
            price = float(data["price"])
            stock = int(data["stock"])
            image = str(data["image"]).strip()
        except ValueError:
            return jsonify({"error": "Tipos de datos inválidos"}), 400

        if not name:
            return jsonify({"error": "El nombre no puede estar vacío"}), 400

        #  Insertar en base de datos
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO products (nombre, descripcion, precio, stock, imagen_url)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(query, (name, description, price, stock, image))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Producto creado correctamente"}), 201

    except Exception as e:
        print(" ERROR REAL:", e)
        return jsonify({"error": "Error interno del servidor"}), 500


# 🔹 Eliminar producto
@product_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    try:
        claims = get_jwt()

        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM products WHERE id = %s", (id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Producto eliminado correctamente"}), 200

    except Exception as e:
        print(" ERROR DELETE:", e)
        return jsonify({"error": "Error eliminando producto"}), 500
