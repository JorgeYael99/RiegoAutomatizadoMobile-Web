import "./ProductCard.css";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

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

  const { addToCart } = useCart();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="product-card amazon">

      {/* Imagen o default */}
      <img
        src={image || "/products/default.webp"}
        alt={name}
      />

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
          onClick={() =>
            addToCart({
              id,
              name,
              price,
              image: image || "",
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
