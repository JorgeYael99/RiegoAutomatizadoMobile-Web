import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; 
import "./Contact.css";
import { sendContactMessage } from "../../api/contact";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

export default function Contact() {
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetId = useRef<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number | undefined;

    const renderCaptcha = () => {
      if (!captchaRef.current || !window.grecaptcha || captchaWidgetId.current !== null) {
        return;
      }

      captchaWidgetId.current = window.grecaptcha.render(captchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(null),
        "error-callback": () => setCaptchaToken(null)
      });

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };

    renderCaptcha();
    intervalId = window.setInterval(renderCaptcha, 300);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setSubmitMessage("Por favor confirma que no eres un robot.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      await sendContactMessage({
        nombre: formData.nombre,
        email: formData.email,
        asunto: formData.asunto,
        mensaje: formData.mensaje,
        captchaToken
      });
      setSubmitMessage("¡Mensaje enviado con éxito! Te contactaremos pronto.");
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      setCaptchaToken(null);
      if (window.grecaptcha && captchaWidgetId.current !== null) {
        window.grecaptcha.reset(captchaWidgetId.current);
      }
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

            <div className="recaptcha-container" ref={captchaRef} />

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
