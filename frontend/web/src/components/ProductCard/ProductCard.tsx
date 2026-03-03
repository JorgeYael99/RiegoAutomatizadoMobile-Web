import "./ProductCard.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  name: string;
  price: number;
  image?: string;
  description: string;
}

export default function ProductCard({ id, name, price, image, description }: Props) {
  const { addToCart, cartItems } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.filter(item => item.id === id).length;
      setItemCount(count);
    }
  }, [cartItems, id]);

  const handleAddToCart = () => {
    if (!token) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    addToCart({ id, name, price, image: image || "", quantity: 1 });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="product-card amazon">
      {/* --- CONTENEDOR CON ANIMACIÓN FLIP --- */}
      <div className="image-container flip-container">
        <div className="flip-card-inner">
          
          {/* CARA FRONTAL (Imagen) */}
          <div className="flip-card-front">
            <img src={image || "https://via.placeholder.com/200"} alt={name} />
            {itemCount > 0 && (
              <span className="cart-count-badge">
                {itemCount}
              </span>
            )}
          </div>

          {/* CARA TRASERA (Descripción) */}
          <div className="flip-card-back">
            <div className="back-content">
              <h5>Descripción</h5>
              <p>{description}</p>
            </div>
          </div>

        </div>
      </div>

      {/* --- CONTENIDO INFERIOR --- */}
      <div className="card-content">
        <h4>{name}</h4>
        <span className="price">${price} MXN</span>

        <button 
          onClick={handleAddToCart}
          className={!token ? "disabled-btn" : ""}
        >
          {token ? "Agregar al carrito" : "Inicia sesión"}
        </button>

        {showLoginPrompt && (
          <div className="login-prompt">
            <p>🔒 Inicia sesión para comprar</p>
            <button onClick={() => navigate('/login')} className="login-prompt-btn">
              Login
            </button>
          </div>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          <span>✅ {name} agregado</span>
        </div>
      )}
    </div>
  );
}