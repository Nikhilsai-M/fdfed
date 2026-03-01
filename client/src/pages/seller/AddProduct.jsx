import { useState } from "react";
import axios from "axios";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  .add-input {
    padding: 12px 14px;
    margin-bottom: 12px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    background: #f8fafc;
    width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    outline: none;
  }
  .add-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    background: #fff;
  }
  .add-input::placeholder { color: #94a3b8; }

  .add-select {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    background: #f8fafc;
    width: 100%;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .add-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    background-color: #fff;
  }

  .cat-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 30px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .cat-chip:hover { border-color: #a5b4fc; color: #6366f1; background: #eef2ff; }
  .cat-chip.active {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  }

  .upload-box {
    border: 2px dashed #c7d2fe;
    border-radius: 14px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    background: #f8f9ff;
    margin-bottom: 24px;
  }
  .upload-box:hover { border-color: #6366f1; background: #eef2ff; }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.18s, transform 0.16s, box-shadow 0.18s;
    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
  }
  .submit-btn:hover { opacity: 0.92; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(99,102,241,0.4); }
  .submit-btn:active { transform: translateY(0); }

  .section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 14px;
    padding: 22px 22px 10px;
    margin-bottom: 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
    animation: fadeUp 0.4s ease both;
  }

  .spec-fields { animation: fadeIn 0.3s ease both; }

  .back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: #818cf8; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
    transition: opacity 0.16s;
  }
  .back-btn:hover { opacity: 0.7; }
`;

const categoryMeta = {
  charger: { icon: "⚡", label: "Charger" },
  mouse:   { icon: "🖱️", label: "Mouse" },
  earphone:{ icon: "🎧", label: "Earphone" },
  smartwatch: { icon: "⌚", label: "Smartwatch" },
};

export default function AddProduct() {
  const token = localStorage.getItem("sellerToken");

  const [category, setCategory] = useState("charger");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    id: "", title: "", brand: "", originalPrice: "", discount: "", stock: "",
    wattage: "", type: "", outputCurrent: "", connectivity: "", resolution: "",
    design: "", batteryLife: "", displaySize: "", displayType: "", batteryRuntime: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("category", category);
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (imageFile) data.append("image", imageFile);
      await axios.post("http://localhost:3000/api/seller/products", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Product Added Successfully!");
      window.location.href = "/seller/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const renderCategoryFields = () => {
    switch (category) {
      case "charger": return (
        <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
          <Input name="wattage" placeholder="Wattage (e.g. 20W)" onChange={handleChange} />
          <Input name="type" placeholder="Type (USB C / Lightning)" onChange={handleChange} />
          <Input name="outputCurrent" placeholder="Output Current (e.g. 3A)" onChange={handleChange} />
        </div>
      );
      case "mouse": return (
        <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
          <Input name="type" placeholder="Mouse Type (Gaming / Office)" onChange={handleChange} />
          <Input name="connectivity" placeholder="Connectivity (Wired / Wireless)" onChange={handleChange} />
          <Input name="resolution" placeholder="Resolution (e.g. 1600 DPI)" onChange={handleChange} />
        </div>
      );
      case "earphone": return (
        <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
          <Input name="design" placeholder="Design (In-ear / Over-ear)" onChange={handleChange} />
          <Input name="batteryLife" placeholder="Battery Life (e.g. 20 hrs)" onChange={handleChange} />
        </div>
      );
      case "smartwatch": return (
        <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
          <Input name="displaySize" placeholder="Display Size (e.g. 1.5 inch)" onChange={handleChange} />
          <Input name="displayType" placeholder="Display Type (AMOLED / LCD)" onChange={handleChange} />
          <Input name="batteryRuntime" placeholder="Battery Runtime (e.g. 5 days)" onChange={handleChange} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background decoration */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top bar */}
        <div style={{
          padding: "0 44px", height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button className="back-btn" onClick={() => window.location.href = "/seller/dashboard"}>
              ← Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>
              Add New Product
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#475569", letterSpacing: "0.05em" }}>
            {categoryMeta[category].icon} {categoryMeta[category].label} Selected
          </span>
        </div>

        {/* Form area */}
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "40px 24px 60px",
          position: "relative", zIndex: 2,
        }}>
          <div style={{
            width: "100%", maxWidth: 660,
            animation: "fadeUp 0.45s ease both",
          }}>

            {/* Card header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
                animation: "float 3s ease-in-out infinite",
              }}>
                {categoryMeta[category].icon}
              </div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 26, color: "#fff", letterSpacing: "-0.03em",
              }}>Add New Product</h2>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
                Fill in the details to list your product on the store
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Category Chips */}
              <div className="section-card">
                <SectionLabel icon="🏷️" text="Product Category" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  {Object.entries(categoryMeta).map(([val, meta]) => (
                    <button
                      key={val}
                      type="button"
                      className={`cat-chip ${category === val ? "active" : ""}`}
                      onClick={() => setCategory(val)}
                    >
                      {meta.icon} {meta.label}
                    </button>
                  ))}
                </div>

                {/* Hidden select for form compatibility */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ display: "none" }}
                >
                  <option value="charger">Charger</option>
                  <option value="mouse">Mouse</option>
                  <option value="earphone">Earphone</option>
                  <option value="smartwatch">Smartwatch</option>
                </select>
              </div>

              {/* Basic Details */}
              <div className="section-card" style={{ animationDelay: "0.07s" }}>
                <SectionLabel icon="📋" text="Basic Details" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input name="id" placeholder="Product ID" onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input name="title" placeholder="Product Title" onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input name="brand" placeholder="Brand Name" onChange={handleChange} />
                  </div>
                  <Input type="number" name="originalPrice" placeholder="Original Price (₹)" onChange={handleChange} />
                  <Input type="number" name="discount" placeholder="Discount (%)" onChange={handleChange} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input type="number" name="stock" placeholder="Stock Quantity" onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="section-card" style={{ animationDelay: "0.14s" }}>
                <SectionLabel icon="⚙️" text={`${categoryMeta[category].label} Specifications`} />
                {renderCategoryFields()}
              </div>

              {/* Image Upload */}
              <div
                className="upload-box"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  required
                />
                {!imageFile ? (
                  <>
                    <div style={{ fontSize: 36, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📤</div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#6366f1", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>
                      Click to Upload Product Image
                    </p>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>PNG, JPG up to 5MB</span>
                  </>
                ) : (
                  <>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      style={{
                        width: "100%", borderRadius: 12, marginBottom: 12,
                        maxHeight: 220, objectFit: "cover",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      }}
                    />
                    <p style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, marginBottom: 4 }}>{imageFile.name}</p>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Click to change image</span>
                  </>
                )}
              </div>

              <button type="submit" className="submit-btn">
                ✦ Add Product to Store
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* Section label helper */
const SectionLabel = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <span style={{
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
    }}>{icon}</span>
    <span style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 700,
      fontSize: 13, color: "#1e293b", letterSpacing: "0.01em",
    }}>{text}</span>
  </div>
);

/* Reusable Input */
const Input = ({ type = "text", ...props }) => (
  <input type={type} {...props} required className="add-input" />
);

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    fontFamily: "Inter, sans-serif"
  },
  card: {
    width: "650px",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600"
  },
  section: {
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column"
  },
  label: {
    marginBottom: "10px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#475569"
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    transition: "all 0.2s"
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  },
  fileInput: {
    marginBottom: "15px"
  },
  preview: {
    width: "100%",
    borderRadius: "12px",
    marginTop: "10px"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px"
  }
};