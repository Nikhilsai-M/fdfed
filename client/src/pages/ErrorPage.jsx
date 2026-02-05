import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ErrorPage({ code = 404, message }) {
  const navigate = useNavigate();
  const location = useLocation();

  const msg =
    message ||
    (code === 404
      ? `No page found at ${location.pathname}`
      : "Something went wrong. Please try again.");

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>{code}</h1>
        <h2 style={styles.title}>Oops! 😥</h2>
        <p style={styles.message}>{msg}</p>

        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate("/")}>
            Go Home
          </button>
          <button style={styles.btnOutline} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  code: {
    fontSize: "64px",
    margin: "0",
    color: "#764ba2",
  },
  title: {
    margin: "10px 0",
  },
  message: {
    color: "#555",
    marginBottom: "30px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#764ba2",
    color: "#fff",
    cursor: "pointer",
  },
  btnOutline: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #764ba2",
    background: "#fff",
    color: "#764ba2",
    cursor: "pointer",
  },
};