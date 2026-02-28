import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageInventorySeller() {

  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/seller/products",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProducts(res.data.products);
  };

  const updateStock = async (id, stock, category) => {
    await axios.put(
      `http://localhost:3000/api/seller/products/${id}`,
      { stock, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProducts();
  };

  const toggleActive = async (id, isActive, category) => {
    await axios.put(
      `http://localhost:3000/api/seller/products/${id}`,
      { isActive: !isActive, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProducts();
  };

  return (
    <div style={styles.container}>

      <h1>Manage Inventory</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>
                <input
                  type="number"
                  defaultValue={p.stock}
                  onBlur={(e) => updateStock(p.id, e.target.value, p.category)}
                />
              </td>
              <td>{p.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => toggleActive(p.id, p.isActive, p.category)}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  table: {
    width: "100%",
    background: "white",
    borderCollapse: "collapse",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
  }
};