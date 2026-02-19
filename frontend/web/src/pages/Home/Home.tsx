import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <section className="home">
   
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="glass-card fade-up">
        <div className="content">
          <span className="pill">Tecnología Inteligente 2026</span>
          <h1>Automatiza tu <span>huerto</span></h1>
          <p>
            Control inteligente de riego, monitoreo de plantas y
            recomendaciones personalizadas con tecnología de punta.
          </p>

          <div className="actions">
            <Link to="/about" className="btn-main">
              Conocer más
            </Link>
            
          </div>
        </div>
      </div>

    
      <div className="plants-footer">
        <div className="plant">🌿</div>
        <div className="plant">🌱</div>
        <div className="plant">🍃</div>
        <div className="plant">🌿</div>
        <div className="plant">🌱</div>
        <div className="plant">🍃</div>
        <div className="plant">🌿</div>
      </div>
    </section>
  );
}