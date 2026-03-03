from flask import Blueprint, request, jsonify
from models.order_model import Order
from flask_jwt_extended import jwt_required, get_jwt

order_bp = Blueprint("orders", __name__)

@order_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        orders = Order.get_all()
        return jsonify(orders), 200
        
    except Exception as e:
        print("ERROR getting orders:", e)
        return jsonify({"error": "Error obteniendo pedidos"}), 500


@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        order = Order.get_by_id(order_id)
        
        if not order:
            return jsonify({"error": "Pedido no encontrado"}), 404
        
        items = Order.get_order_items(order_id)
        
        return jsonify({"order": order, "items": items}), 200
        
    except Exception as e:
        print("ERROR getting order:", e)
        return jsonify({"error": "Error obteniendo pedido"}), 500


@order_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        stats = Order.get_stats()
        
        return jsonify(stats), 200
        
    except Exception as e:
        print("ERROR getting stats:", e)
        return jsonify({"error": "Error obteniendo estadísticas"}), 500


@order_bp.route("/export", methods=["GET"])
@jwt_required()
def export_orders():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        orders = Order.get_all_for_export()
        
        return jsonify(orders), 200
        
    except Exception as e:
        print("ERROR exporting orders:", e)
        return jsonify({"error": "Error exportando pedidos"}), 500
