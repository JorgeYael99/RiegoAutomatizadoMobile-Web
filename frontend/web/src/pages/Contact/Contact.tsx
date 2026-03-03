import { useState } from "react";
import { motion } from "framer-motion"; 
import "./Contact.css";
import { sendContactMessage } from "../../api/contact";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      await sendContactMessage({
        nombre: formData.nombre,
        email: formData.email,
        asunto: formData.asunto,
        mensaje: formData.mensaje
      });
      setSubmitMessage("¡Mensaje enviado con éxito! Te contactaremos pronto.");
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setSubmitMessage("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <motion.div 
        className="contact-card-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* PANEL IZQUIERDO: VERDE */}
        <div className="contact-info-panel">
          <h2>Contacto</h2>
          <p>¿Tienes dudas sobre tus sensores o el dashboard? Nuestro equipo técnico está listo para ayudarte.</p>
          <div className="contact-badge">Soporte 24/7</div>
        </div>

        {/* PANEL DERECHO: DATOS (AJUSTADO) */}
        <div className="contact-form-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>NOMBRE COMPLETO</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>CORREO ELECTRÓNICO</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>ASUNTO</label>
              <select
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="problema-producto">Problema con producto/sensor</option>
                <option value="duda-general">Duda técnica general</option>
                <option value="colaboracion">Propuesta de colaboración</option>
              </select>
            </div>

            <div className="form-group">
              <label>MENSAJE</label>
              <textarea
                name="mensaje"
                placeholder="¿En qué podemos ayudarte hoy?"
                rows={3}
                value={formData.mensaje}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-submit-modern"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
            </button>

            {submitMessage && (
              <p className={`status-text ${submitMessage.includes('éxito') ? 'success' : 'error'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}