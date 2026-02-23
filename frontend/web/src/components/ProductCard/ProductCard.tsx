import "./ProductCard.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  id: number;
  name: string;
  price: number;
  image?: string;
  description: string;
}
export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
}: Props) {
  const { addToCart, cart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const itemCount = cart.filter(item => item.id === id).length;
  const handleAddToCart = () => {
    if (!token) {
      setShowLoginPrompt(true);
      setTimeout(() => {
        setShowLoginPrompt(false);
      }, 3000);
      return;
    }
    addToCart({
      id,
      name,
      price,
      image: image || "",
      quantity: 1,
    });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };
  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { from: '/products', message: 'Inicia sesión para agregar productos al carrito' }
    });
  };
  return (
    <div className="product-card amazon">
      <div className="image-container">
        <img
          src={image || "/products/default.webp"}
          alt={name}
        />
        {itemCount > 0 && (
          <span className="cart-count-badge">
            🛒 {itemCount}
          </span>
        )}
      </div>
      <div className="card-content">
        <h4>{name}</h4>
        <p className={`hpola ${showMore ? "expanded" : ""}`}>
          {description}
        </p>
        <span className="see-more" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Ver menos" : "Ver más"}
        </span>
        <span className="price">${price} MXN</span>
        <button 
          onClick={handleAddToCart}
          className={!token ? "disabled-btn" : ""}
        >
          {token ? "Agregar al carrito" : "Inicia sesión para comprar"}
        </button>
        {showLoginPrompt && (
          <div className="login-prompt">
            <p>🔒 Necesitas iniciar sesión para agregar productos</p>
            <button onClick={handleLoginRedirect} className="login-prompt-btn">
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
      {showNotification && (
        <div className="notification">
          <span>✅</span>
          <span>{name} agregado</span>
        </div>
      )}
    </div>
  );
}
