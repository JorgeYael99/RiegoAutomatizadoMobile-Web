import { useState, useEffect } from "react";
import "./Home.css";

// Importación del nuevo componente de scroll
import ScrollPlant from "../../components/ScrollPlant/ScrollPlant";

import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img 3.jpg";


const carouselData = [
  { id: 1, title: "Nuestros Agricultores", topic: "HUERTO SMART", desc: "El 60% de los agricultores dependen de condiciones naturales.", img: img1 },
  { id: 2, title: "Huerto Inteligente", desc: "Monitoreo constante para decisiones basadas en datos reales.", img: img2 },
  { id: 3, title: "Dato Curioso", topic: "CULTIVO DIGITAL", desc: "Las plantas usan la luz del sol para crecer sanas y fuertes.", img: img3 }
];

export default function Home() {
  const [items, setItems] = useState(carouselData);

  useEffect(() => {
    const autoNext = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 7000); 

    return () => clearInterval(autoNext);
  }, []);

  return (
    <main className="home-main-wrapper">
      {/* SECCIÓN DEL CARRUSEL */}
      <section className="home">
        <div className="andev-carousel">
          <div className="list">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="item" 
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className="carousel-content">
                  <div className="author">TECNOLOGÍA 2026</div>
                  <div className="title">{item.title}</div>
                  <div className="topic">{item.topic}</div>
                  <div className="des">{item.desc}</div>
                  <div className="buttons">
                    {/* Botones opcionales aquí */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN NARRATIVA DE LA PLANTA (TikTok Style) */}
      <ScrollPlant />

      {/* Aquí podrías agregar tu grid de sensores más abajo */}
    </main>
  );
}