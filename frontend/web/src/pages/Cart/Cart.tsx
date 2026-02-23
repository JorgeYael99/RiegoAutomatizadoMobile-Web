// frontend/web/src/pages/Cart/Cart.tsx
import "./Cart.css";
import { useCart } from "../../context/CartContext";
import PayPalButton from "./PaypalButton";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const handlePaymentSuccess = () => {
    if (clearCart) {
      clearCart();
      alert("¡Gracias por tu compra!");
    }
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="cart-page fade-up">
        <h2>Tu carrito</h2>
        <div className="cart-empty">
          <p>Tu carrito está vacío 🌱</p>
          <Link to="/products" className="btn-shop">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page fade-up">
      <h2>Tu carrito</h2>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              
              <div className="cart-info">
                <h4>{item.name}</h4>
                <span className="item-price">${item.price} MXN</span>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="quantity-btn"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    aria-label={`Cantidad de ${item.name}`}
                    onChange={(e) => 
                      handleQuantityChange(item, Number(e.target.value))
                    }
                    className="quantity-input"
                  />
                  
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="quantity-btn"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  aria-label={`Eliminar ${item.name}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumen de compra</h3>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total} MXN</span>
          </div>
          
          <div className="summary-row">
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total} MXN</span>
          </div>

          <PayPalButton total={total} items={cart} onSuccess={handlePaymentSuccess} />
          
          <button 
            onClick={clearCart} 
            className="clear-cart-btn"
            aria-label="Vaciar carrito"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </section>
  );
}