import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer fade-up">
      <div className="footer-content">
        <div className="footer-section">
          <h4>🌱 HuertoSmart</h4>
          <p>
            Tecnología aplicada a la agricultura inteligente.
            Automatizamos, cuidamos y mejoramos tus cultivos.
          </p>
        </div>

        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Nosotros</Link></li>
            <li><Link to="/products">Productos</Link></li>
            <li><Link to="/cart">Carrito</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📍 México</p>
          <p>📧 contacto@huertosmart.com</p>
          <p>📞 +52 55 0000 0000</p>
        </div>

        <div className="footer-section map">
          <iframe
            title="Mapa HuertoSmart"
            src="https://www.google.com/maps?q=Mexico&output=embed"
            loading="lazy"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HuertoSmart</p>
      </div>
    </footer>
  );
}
