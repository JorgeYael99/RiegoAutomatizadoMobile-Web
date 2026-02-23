import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando productos...</p>;

  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id = {product.id}
          name={product.nombre}
          description={product.descripcion}
          price={product.precio}
          image={product.imagen_url}
        />
      ))}
    </div>
  );
}
