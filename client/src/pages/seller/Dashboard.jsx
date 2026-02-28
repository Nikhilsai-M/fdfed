import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerDashboard() {

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });

  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/api/seller/products",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProducts(res.data.products);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/api/seller/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStats(res.data.stats);

    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id, category) => {

    try {

      await axios.delete(
        `http://localhost:3000/api/seller/products/${id}`,
        {
          data: { category },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchProducts();

    } catch (err) {
      console.error(err);
    }
  };

const logout = async () => {

  try {

    await axios.post("http://localhost:3000/api/seller/logout");

  } catch (err) {
    console.error(err);
  }

  localStorage.removeItem("sellerToken");
  window.location.href = "/seller/login";

};

  return (

    <div style={styles.page}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <h2 style={styles.logo}>Seller Panel</h2>

        <button style={styles.navBtn}>Dashboard</button>

        <button
          style={styles.navBtn}
          onClick={() => window.location.href = "/seller/manage-inventory"}
        >
          Manage Inventory
        </button>

        <button
          style={styles.navBtn}
          onClick={() => window.location.href = "/seller/add-product"}
        >
          Add Product
        </button>

        <button
          style={styles.navBtn}
          onClick={() => window.location.href = "/seller/orders"}
        >
          Orders
        </button>

        <button
          style={styles.navBtn}
          onClick={() => window.location.href = "/seller/profile"}
        >
          Profile
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>

      </div>


      {/* MAIN CONTENT */}

      <div style={styles.main}>

        <h1 style={styles.title}>Seller Dashboard</h1>

        {/* DASHBOARD STATS */}

        <div style={styles.stats}>

          <div style={styles.card}>
            <h3>Total Products</h3>
            <p style={styles.number}>{stats.totalProducts}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Orders</h3>
            <p style={styles.number}>{stats.totalOrders}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Revenue</h3>
            <p style={styles.number}>₹{stats.revenue}</p>
          </div>

        </div>


        {/* PRODUCT TABLE */}

        <h2 style={styles.sectionTitle}>Your Products</h2>

        <table style={styles.table}>

          <thead style={styles.thead}>
            <tr>
              <th>Title</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.map((p) => (

              <tr key={p.id} style={styles.row}>

                <td>{p.title}</td>
                <td>{p.brand}</td>
                <td>₹{p.originalPrice}</td>
                <td>{p.stock}</td>

                <td>

                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      window.location.href = `/seller/edit/${p.id}`
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteProduct(p.id, p.category)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


const styles = {

  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial",
    background: "#f4f6f9"
  },

  sidebar: {
    width: "240px",
    background: "#1e293b",
    color: "white",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  logo: {
    marginBottom: "20px"
  },

  navBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    textAlign: "left",
    fontSize: "16px",
    cursor: "pointer",
    padding: "10px"
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  main: {
    flex: 1,
    padding: "40px"
  },

  title: {
    marginBottom: "25px"
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    width: "180px"
  },

  number: {
    fontSize: "22px",
    fontWeight: "bold"
  },

  sectionTitle: {
    marginBottom: "15px"
  },

  table: {
    width: "100%",
    background: "white",
    borderRadius: "10px",
    borderCollapse: "collapse",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  thead: {
    background: "#f1f5f9"
  },

  row: {
    borderBottom: "1px solid #eee"
  },

  editBtn: {
    marginRight: "10px",
    padding: "6px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }

};