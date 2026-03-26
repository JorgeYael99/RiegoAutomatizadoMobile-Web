# backend/routes/chatbot_routes.py
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__)

RESPUESTAS = {
    "saludos": [
        "¡Hola! 👋 Bienvenido a HuertoSmart. ¿En qué puedo ayudarte hoy?",
        "¡Hola! 🌱 Soy tu asistente virtual. Puedo ayudarte con información sobre nuestros productos de riego.",
        "¡Buenos días! 🌿 ¿Tienes alguna pregunta sobre nuestros sistemas de riego?"
    ],
    "productos": [
        "🌿 Tenemos sistemas de riego automatizado, sensores de humedad, programadores, mangueras, semillas y herramientas de jardín.",
        "📦 Nuestros productos incluyen: sistemas de riego por goteo, aspersores automáticos, controladores WiFi, y kits completos para huertos.",
        "🌱 Ofrecemos: kits de riego para macetas, sistemas para jardines grandes, sensores de humedad del suelo, y temporizadores digitales."
    ],
    "precios": [
        "💰 Nuestros precios van desde $15.000 hasta $500.000 COP. ¿Te interesa alguna categoría en particular?",
        "📊 Tenemos opciones para todos los presupuestos: kits básicos desde $15.000, sistemas intermedios desde $80.000, y sistemas profesionales desde $200.000.",
        "💵 El precio depende del tipo de sistema. Los sensores de humedad comienzan en $25.000, los controladores en $45.000, y los kits completos en $150.000."
    ],
    "envio": [
        "🚚 Realizamos envíos a todo Colombia. Tiempo de entrega: 2-5 días hábiles.",
        "📦 Envío gratis para pedidos superiores a $100.000 COP. Para el resto del país: $10.000 COP.",
        "🏠 Puedes recoger tu pedido en nuestro punto de venta o solicitar envío a domicilio."
    ],
    "contacto": [
        "📞 Puedes contactarnos por WhatsApp: +57 300 123 4567 o email: contacto@huertoSmart.com",
        "💬 Nuestro horario de atención es Lunes a Viernes de 8am a 6pm. ¡Escríbenos!",
        "📱 Contáctanos por redes sociales: @HuertoSmart en Instagram y Facebook."
    ],
    "garantia": [
        "✅ Todos nuestros productos tienen garantía de 6 meses por defectos de fábrica.",
        "🛡️ Ofrecemos garantía en sensores, controladores y bombas. Consulta los términos específicos de cada producto.",
        "✅ Si tu producto presenta fallas, puedes devolverlo dentro de los primeros 30 días."
    ],
    "instalacion": [
        "🔧 Nuestros kits incluyen manual de instalación. Para sistemas grandes, ofrecemos servicio de instalación con costo adicional.",
        "📚 Contamos con videos tutoriales en nuestro sitio web. La mayoría de nuestros sistemas son fáciles de instalar.",
        "💡 No necesitas ser experto. Nuestros productos vienen con guías paso a paso."
    ],
    "pago": [
        "💳 Aceptamos tarjetas de crédito/débito, PSE, Nequi, Daviplata y pagos en efectivo.",
        "💵 Puedes pagar con PayPal, transferencia bancaria o contraentrega en ciertas zonas.",
        "📄 Ofrecemos pago en cuotas con Addi y Mercado Pago."
    ],
    "tiempo": [
        "⏱️ Los sensores monitorean la humedad cada 30 minutos y activan el riego automáticamente.",
        "⏰ Puedes programar horarios específicos: mañana, tarde o noche. ¡Tú decides!",
        "💧 El sistema detecta cuando tu planta necesita agua y actúa instantáneamente."
    ],
    "agua": [
        "💧 Nuestros sistemas ahorran hasta un 50% de agua comparado con el riego manual.",
        "🌊 El sensor mide la humedad del suelo y solo riega cuando es necesario.",
        "💦 Gracias a la automatización, solo usas el agua exacta que tus plantas necesitan."
    ],
    "gracias": [
        "😊 ¡De nada! ¿Hay algo más en lo que pueda ayudarte?",
        "🙏 ¡Gracias a ti por contactarnos! Estoy aquí para lo que necesites.",
        "🌱 ¡Feliz de ayudar! Pregúntame lo que quieras sobre nuestros productos."
    ],
    "default": [
        "🤔 No estoy seguro de entender. Puedo ayudarte con: productos, precios, envíos, contacto o garantía. ¿Qué te gustaría saber?",
        "❓ Puedo responder preguntas sobre: sistemas de riego, sensores de humedad, precios, envío y más. ¿Sobre qué tema quieres información?",
        "📝 Disculpa, no entendí. Prueba preguntando por 'productos', 'precios', 'envío' o 'contacto'."
    ]
}

def obtener_respuesta(mensaje):
    mensaje = mensaje.lower()
    
    if any(p in mensaje for p in ["hola", "buenos", "buenas", "saludos", "qué tal", "hey", "buen día"]):
        return RESPUESTAS["saludos"][0]
    
    if any(p in mensaje for p in ["producto", "productos", "qué venden", "tienen", "ofrecen", "catalogo", "catálogo", "vender"]):
        return RESPUESTAS["productos"][0]
    
    if any(p in mensaje for p in ["precio", "precios", "costo", "cuánto", "vale", "cuesta", "valor"]):
        return RESPUESTAS["precios"][0]
    
    if any(p in mensaje for p in ["envío", "envio", "envían", "entrega", "llega", "domicilio", "shipping", "mandar"]):
        return RESPUESTAS["envio"][0]
    
    if any(p in mensaje for p in ["contacto", "contactar", "hablar", "whatsapp", "teléfono", "telefono", "email", "correo", "comunicar"]):
        return RESPUESTAS["contacto"][0]
    
    if any(p in mensaje for p in ["garantía", "garantia", "devolución", "devolver", "cambio", "reembolso"]):
        return RESPUESTAS["garantia"][0]
    
    if any(p in mensaje for p in ["instalar", "instalación", "instalacion", "montar", "configurar", "armar", "poner"]):
        return RESPUESTAS["instalacion"][0]
    
    if any(p in mensaje for p in ["pagar", "pago", "tarjeta", "nequi", "daviplata", "paypal", "transferencia", "pse"]):
        return RESPUESTAS["pago"][0]
    
    if any(p in mensaje for p in ["tiempo", "cada cuánto", "frecuencia", "programar", "horario", "cada cuanto"]):
        return RESPUESTAS["tiempo"][0]
    
    if any(p in mensaje for p in ["agua", "ahorrar", "consumo", "gasto", "ahorro"]):
        return RESPUESTAS["agua"][0]
    
    if any(p in mensaje for p in ["gracias", "agradezco", "muchas gracias", "excelente", "genial"]):
        return RESPUESTAS["gracias"][0]
    
    return RESPUESTAS["default"][0]

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or not data.get('message'):
            return jsonify({'error': 'Mensaje requerido'}), 400

        user_message = data.get('message')
        reply = obtener_respuesta(user_message)
        
        return jsonify({'reply': reply})

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'reply': '❌ Ocurrió un error. Por favor, intenta de nuevo.'}), 500
