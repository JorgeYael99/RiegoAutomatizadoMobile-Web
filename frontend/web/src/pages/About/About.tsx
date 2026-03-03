import { useEffect, useState } from "react";
import "./About.css";
import { motion, AnimatePresence } from "framer-motion";
// Importa tus imágenes aquí (ejemplo)
import imgAntes from "../../assets/img/img6.jpg"; 
import imgDespues from "../../assets/img/img7.jpeg"; 

const comparisonImages = [imgAntes, imgDespues];

export default function About() {
  const [mapsKey, setMapsKey] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % comparisonImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://riego-automatizado-mobile-web.vercel.app/api/maps-key")
      .then(res => res.json())
      .then(data => setMapsKey(data.key))
      .catch(err => console.error("Error", err));
  }, []);

  return (
    <div className="about-wrapper">
      {/* HERO SECTION */}
      <header className="about-hero">
        <span className="brand-label">TECNOLOGÍA 2026</span>
        <h1>Sobre Nosotros</h1>
        <p className="hero-subtitle">Innovación y agricultura inteligente para un futuro sostenible.</p>
      </header>

      {/* HISTORIA + IMAGEN */}
      <section className="about-main-grid">
        <div className="story-content">
          <div className="accent-bar"></div>
          <h2>Nuestra historia</h2>
          <p>HuertoSmart nace como un proyecto de automatización de riego, enfocado en ayudar a pequeños y medianos productores a optimizar el uso del agua y mejorar la calidad de sus cultivos mediante tecnología.</p>
          <p>Con el tiempo, el proyecto evolucionó hacia una solución integral que combina IoT, aplicaciones móviles y asistentes inteligentes, todo diseñado para funcionar incluso sin conexión a internet.</p>
        </div>

        <div className="image-fade-container">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex}
              src={comparisonImages[currentImageIndex]} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fade-img-display"
            />
          </AnimatePresence>
          <div className="fade-caption">
            {currentImageIndex === 0 ? "Cultivo Tradicional" : "Sistema HuertoSmart"}
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="values-grid">
        <div className="value-card-modern">
          <div className="value-icon">🌱</div>
          <h3>Misión</h3>
          <p>Facilitar el acceso a tecnología agrícola inteligente y sostenible, promoviendo prácticas eficientes.</p>
        </div>
        <div className="value-card-modern">
          <div className="value-icon">🚀</div>
          <h3>Visión</h3>
          <p>Convertirnos en la plataforma líder en soluciones de agricultura inteligente accesible para todos.</p>
        </div>
      </section>

      {/* MAPA */}
      <section className="map-section-modern">
        <h2>Dónde estamos</h2>
        <div className="map-frame-modern">
          {mapsKey && (
            <iframe title="mapa" src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=19.362,-99.049`} />
          )}
        </div>
      </section>
    </div>
  );
}