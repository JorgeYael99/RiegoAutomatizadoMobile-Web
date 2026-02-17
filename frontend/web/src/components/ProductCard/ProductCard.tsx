import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

interface Props {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
}: Props) {
  const { addToCart } = useCart();

  return (
    <div className="product-card fade-up">
      <img src={image} alt={name} />

      <div className="card-content">
        <h4>{name}</h4>
        <p>{description}</p>
        <span>${price} MXN</span>

        <button
          onClick={() =>
            addToCart({
              id,
              name,
              price,
              image,
              quantity: 1,
            })
          }
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
