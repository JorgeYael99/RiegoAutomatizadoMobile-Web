import { useState } from "react";
import "./Contact.css";
import { sendContactMessage } from "../../api/contact"; // Agregar import


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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage("");
  try {
    const response = await sendContactMessage({
      nombre: formData.nombre,
      email: formData.email,
      asunto: formData.asunto,
      mensaje: formData.mensaje
    });
    setSubmitMessage("¡Mensaje enviado con éxito! Te contactaremos pronto.");
    setFormData({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: ""
    });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    setSubmitMessage("Error al enviar el mensaje. Intenta de nuevo.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="contact-page fade-up">
      <div className="contact-container">
        <h2>Contacto</h2>
        <p className="contact-description">
          ¿Tienes alguna pregunta o problema? Escríbenos y te responderemos lo antes posible.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="asunto">Asunto</label>
            <select
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecciona un asunto</option>
              <option value="problema-producto">Problema con algún producto</option>
              <option value="duda-general">Duda general</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              value={formData.mensaje}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </button>

          {submitMessage && (
            <div className="success-message">
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
