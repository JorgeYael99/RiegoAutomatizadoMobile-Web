import "./Footer.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mapsKey, setMapsKey] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/maps-key")
      .then(res => res.json())
      .then(data => {
        setMapsKey(data.key);
      })
      .catch(err => console.error("Error al obtener la API de Google Maps", err));
  }, []);

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
          {mapsKey && (
            <iframe
              title="Mapa HuertoSmart"
              src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=19.362,-99.049`}
              loading="lazy"
            />
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HuertoSmart</p>
      </div>
    </footer>
  );
}