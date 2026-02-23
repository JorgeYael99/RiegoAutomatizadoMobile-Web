import "./ProductCard.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // Importamos useAuth
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir al login

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
  const { addToCart, cartItems } = useCart();
  const { token } = useAuth(); // Obtenemos el token del usuario
  const navigate = useNavigate(); // Para navegar al login
  const [showMore, setShowMore] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Para mostrar mensaje de login
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.filter(item => item.id === id).length;
      setItemCount(count);
    }
  }, [cartItems, id]);

  const handleAddToCart = () => {
    // Verificar si el usuario está logueado
    if (!token) {
      // Mostrar mensaje de que necesita iniciar sesión
      setShowLoginPrompt(true);
      // Opcional: Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowLoginPrompt(false);
      }, 3000);
      return;
    }

    // Si está logueado, agregar al carrito
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
          src={image || "https://via.placeholder.com/200"}
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

        <span
          className="see-more"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Ver menos" : "Ver más"}
        </span>

        <span className="price">${price} MXN</span>

        <button 
          onClick={handleAddToCart}
          className={!token ? "disabled-btn" : ""} // Clase opcional para estilo diferente
        >
          {token ? "Agregar al carrito" : "Inicia sesión para comprar"}
        </button>

        {/* Mensaje de advertencia para login */}
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