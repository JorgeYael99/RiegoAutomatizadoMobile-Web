import "./About.css";
import { useEffect, useState } from "react";

export default function About() {
  const [mapsKey, setMapsKey] = useState("");

  useEffect(() => {
    fetch("https://riego-automatizado-mobile-web.vercel.app/api/maps-key")
      .then(res => res.json())
      .then(data => {
        setMapsKey(data.key);
      })
      .catch(err => console.error("Error al obtener la API de Google Maps", err));
  }, []);

  return (
    <section className="about">

      {/* HERO */}
      <div className="about-hero fade-up">
        <h2>Sobre Nosotros</h2>
        <p>
          Innovación, tecnología y agricultura inteligente para un futuro sostenible.
        </p>
      </div>

      {/* HISTORIA */}
      <div className="about-section fade-up">
        <h3>Nuestra historia</h3>
        <p>
          HuertoSmart nace como un proyecto de automatización de riego,
          enfocado en ayudar a pequeños y medianos productores a optimizar
          el uso del agua y mejorar la calidad de sus cultivos mediante tecnología.
        </p>
        <p>
          Con el tiempo, el proyecto evolucionó hacia una solución integral
          que combina IoT, aplicaciones móviles y asistentes inteligentes,
          todo diseñado para funcionar incluso sin conexión a internet.
        </p>
      </div>

      {/* MISION Y VISION */}
      <div className="about-grid fade-up">
        <div className="card">
          <h4>🌱 Misión</h4>
          <p>
            Facilitar el acceso a tecnología agrícola inteligente,
            promoviendo prácticas sostenibles y eficientes.
          </p>
        </div>

        <div className="card">
          <h4>🚀 Visión</h4>
          <p>
            Convertirnos en una plataforma líder en soluciones de
            agricultura inteligente accesible para todos.
          </p>
        </div>
      </div>

      {/* MAPA */}
      <div className="about-section fade-up">
        <h3>Dónde estamos</h3>

        <div className="map-container">
          {mapsKey && (
            <iframe
              title="mapa"
                src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=19.362,-99.049`}
              loading="lazy"
            />
          )}
        </div>
      </div>

    </section>
  );
}