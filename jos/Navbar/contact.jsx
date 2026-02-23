codigo para qu no aparezca el carrito 
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart } from "react-icons/fi"; // Icono de carrito
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  
  // Verificación ESTRICTA del token
  // Solo consideramos autenticado si token es un string válido y no vacío
  const isAuthenticated = token && typeof token === 'string' && token.length > 0 && token !== "null" && token !== "undefined";
  
  console.log("Token:", token);
  console.log("isAuthenticated:", isAuthenticated);
  
  const cartItemCount = 3;

  return (
    <nav className="navbar">
      <h2 className="logo">🌱 HuertoSmart</h2>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        
        {/* Mostrar carrito SOLO si está autenticado */}
        {isAuthenticated && (
          <Link to="/cart" className="cart-link">
            <FiShoppingCart className="cart-icon" />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        )}

        {/* Mostrar login/register SOLO si NO está autenticado */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn-login">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-register">
              Registrarse
            </Link>
          </>
        )}

        {/* Admin solo si está autenticado Y es admin */}
        {isAuthenticated && rol === "admin" && (
          <Link to="/admin" className="btn-admin">
            Admin
          </Link>
        )}

        {/* Cerrar sesión solo si está autenticado */}
        {isAuthenticated && (
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}