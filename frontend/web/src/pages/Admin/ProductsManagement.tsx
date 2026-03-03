import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
}

const API_PRODUCTS = "https://riego-automatizado-mobile-web.vercel.app/api/products";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(API_PRODUCTS, {
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
      setForm({ name: "", price: "", description: "", image: "", stock: "" });
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      await fetch(`${API_PRODUCTS}/${editingProduct.id}`, {
        method: "PUT",
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
      setShowEditModal(false);
      setEditingProduct(null);
      setForm({ name: "", price: "", description: "", image: "", stock: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`${API_PRODUCTS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.nombre,
      price: product.precio.toString(),
      description: product.descripcion,
      image: product.imagen_url,
      stock: product.stock.toString(),
    });
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Productos</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.imagen_url || "https://via.placeholder.com/50"}
                    alt={product.nombre}
                  />
                </td>
                <td>
                  <div className="product-name">{product.nombre}</div>
                  <div className="product-desc">{product.descripcion?.substring(0, 50)}...</div>
                </td>
                <td>${product.precio.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-danger"}`}>
                    {product.stock > 0 ? "Activo" : "Agotado"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => openEditModal(product)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(product.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Producto</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Producto</h2>
              <button className="btn-icon" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .products-page {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .search-box {
          position: relative;
          max-width: 300px;
          margin-bottom: 1.5rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .search-box svg {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .table-container {
          overflow-x: auto;
        }

        .product-name {
          font-weight: 500;
          color: #1e293b;
        }

        .product-desc {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon.danger {
          color: #dc2626;
        }

        .btn-icon.danger:hover {
          background: #fee2e2;
        }

        .empty-cell {
          text-align: center;
          padding: 2rem !important;
          color: #9ca3af;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .data-table {
            font-size: 0.85rem;
          }

          .data-table th,
          .data-table td {
            padding: 0.5rem;
          }

          .data-table img {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
