import "./Cart.css";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  return (
    <section className="cart-page fade-up">
      <h2>Tu carrito</h2>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío 🌱</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-info">
                <h4>{item.name}</h4>
                <span>${item.price} MXN</span>

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                    aria-label={`Cantidad de ${item.name}`} 
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                />

                <button onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <h3>Total: ${total} MXN</h3>
        </>
      )}
    </section>
  );
}
