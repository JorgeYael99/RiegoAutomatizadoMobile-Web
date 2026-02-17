import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export default function Admin() {
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  const API_URL = "http://localhost:5000/api/products";

  // 🔹 Obtener productos
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Crear producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image,
      }),
    });

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    });

    setShowModal(false);
    fetchProducts();
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Productos</li>
          <li>Usuarios</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <button
            className="primary-btn"
            onClick={() => setShowModal(true)}
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p>{products.length}</p>
          </div>

          <div className="stat-card">
            <h3>Stock Total</h3>
            <p>{products.reduce((acc, p) => acc + p.stock, 0)}</p>
          </div>

          <div className="stat-card">
            <h3>Valor Inventario</h3>
            <p>
              $
              {products
                .reduce((acc, p) => acc + p.price * p.stock, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image && (
                    <img src={p.image} alt={p.name} />
                  )}
                </td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (
                        confirm(
                          "¿Seguro que quieres eliminar este producto?"
                        )
                      ) {
                        handleDelete(p.id);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Crear Nuevo Producto</h2>

              <form
                className="modal-form"
                onSubmit={handleSubmit}
              >
                <input
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Precio"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="URL Imagen"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Descripción"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
