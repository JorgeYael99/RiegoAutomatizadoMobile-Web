import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import "./ScrollPlant.css";

import img4 from "../../assets/img/img4.png"; 

const ScrollPlant = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    // CORRECCIÓN: Se usa el nombre correcto de la función para limpiar el evento
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001
  });

  // --- CONFIGURACIÓN DE MOVIMIENTO ---

  // 1. Definimos los rangos de movimiento lateral (X)
  // Usamos 45% para que llegue bien a las orillas de tus cuadros rojos
  const xRange = isMobile 
    ? ["0%", "0%", "0%", "0%", "0%"] 
    : ["0%", "-45%", "45%", "-30%", "0%"];
  
  // 2. Aplicamos xRange a la transformación (Esto quita el error de image_41532a.png)
  const xPos = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], xRange);
  
  // 3. Rotación: la planta se inclina levemente al moverse para mayor realismo
  const rotate = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, -8, 8, -5, 0]);

  // 4. Elevación final y escala: para que no tape el texto al final
  const yPos = useTransform(smoothProgress, [0.8, 1], [0, isMobile ? -60 : -180]); 
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, isMobile ? 0.85 : 1.1, isMobile ? 1 : 1.25]);

  return (
    <div className="scroll-plant-container" ref={containerRef}>
      <div className="sticky-element">
        
        {/* TEXTO DE FONDO estilo HuertoSmart */}
        <motion.h1 
          className="bg-title-scroll"
          style={{ 
            opacity: useTransform(smoothProgress, [0, 0.2], [0.15, 0]),
            y: useTransform(smoothProgress, [0, 0.2], [0, -100])
          }}
        >
          HUERTO SMART
        </motion.h1>

        <motion.div 
          className="plant-wrapper"
          style={{ 
            x: xPos, 
            y: yPos, 
            scale: scale,
            rotate: rotate 
          }}
        >
          <img src={img4} alt="Planta Huerto" className="moving-img" />
        </motion.div>
      </div>

      {/* SECCIÓN 01: Planta al cuadro IZQUIERDO */}
      <section className="scroll-section section-right">
        <motion.div className="info-glass-card" style={{ opacity: useTransform(smoothProgress, [0.1, 0.3], [0, 1]) }}>
          <span className="step-num">01</span>
          <h3>Raíces Inteligentes</h3>
          <p>Tecnología aplicada al monitoreo constante de humedad.</p>
        </motion.div>
      </section>

      {/* SECCIÓN 02: Planta al cuadro DERECHO */}
      <section className="scroll-section section-left">
        <motion.div className="info-glass-card" style={{ opacity: useTransform(smoothProgress, [0.4, 0.6], [0, 1]) }}>
          <span className="step-num">02</span>
          <h3>Decisiones con Datos</h3>
          <p>Visualiza el estado de tus sensores en tiempo real.</p>
        </motion.div>
      </section>

      {/* SECCIÓN 03: Final centrado y elevado */}
      <section className="scroll-section section-center">
        <motion.div className="info-glass-card" style={{ opacity: useTransform(smoothProgress, [0.8, 1], [0, 1]) }}>
          <span className="step-num">03</span>
          <h3>Optimización de Riego</h3>
          <p>Para un futuro sostenible.</p>
        </motion.div>
      </section>
    </div>
  );
};

export default ScrollPlant;