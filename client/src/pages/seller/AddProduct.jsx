import { useState } from "react";
import axios from "axios";
import { handleAxiosUnauthorized } from "../../utils/sessionRedirect";

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
    50% { transform: translateY(-6px); }
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

  .cat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
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

  .cat-chip:hover {
    border-color: #a5b4fc;
    color: #6366f1;
    background: #eef2ff;
  }

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

  .upload-box:hover {
    border-color: #6366f1;
    background: #eef2ff;
  }

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

  .submit-btn:hover {
    opacity: 0.92;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(99,102,241,0.4);
  }

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
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #818cf8;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: opacity 0.16s;
  }

  .back-btn:hover { opacity: 0.7; }
`;

const categoryMeta = {
  charger: { badge: "CH", label: "Charger", idPrefix: "ch" },
  mouse: { badge: "MO", label: "Mouse", idPrefix: "mo" },
  earphone: { badge: "EA", label: "Earphone", idPrefix: "ea" },
  smartwatch: { badge: "SM", label: "Smartwatch", idPrefix: "sm" },
};

const initialFormData = {
  title: "",
  brand: "",
  originalPrice: "",
  discount: "",
  stock: "",
  wattage: "",
  type: "",
  outputCurrent: "",
  connectivity: "",
  resolution: "",
  design: "",
  batteryLife: "",
  displaySize: "",
  displayType: "",
  batteryRuntime: "",
};

export default function AddProduct() {
  const [category, setCategory] = useState("charger");
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setFormData((prev) => ({ ...initialFormData, title: prev.title, brand: prev.brand, originalPrice: prev.originalPrice, discount: prev.discount, stock: prev.stock }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("category", category);

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          data.append(key, value);
        }
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.post("http://localhost:3000/api/seller/products", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const generatedId = res.data?.product?.id;
      alert(
        generatedId
          ? `Product added successfully. Product ID: ${generatedId}`
          : "Product added successfully."
      );
      window.location.href = "/seller/dashboard";
    } catch (err) {
      if (handleAxiosUnauthorized(err, "seller")) return;
      console.error(err);
      alert("Error adding product");
    }
  };

  const renderCategoryFields = () => {
    switch (category) {
      case "charger":
        return (
          <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
            <Input name="wattage" placeholder="Wattage (e.g. 20W)" onChange={handleChange} value={formData.wattage} />
            <Input name="type" placeholder="Type (USB C / Lightning)" onChange={handleChange} value={formData.type} />
            <Input name="outputCurrent" placeholder="Output Current (e.g. 3A)" onChange={handleChange} value={formData.outputCurrent} />
          </div>
        );
      case "mouse":
        return (
          <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
            <Input name="type" placeholder="Mouse Type (Gaming / Office)" onChange={handleChange} value={formData.type} />
            <Input name="connectivity" placeholder="Connectivity (Wired / Wireless)" onChange={handleChange} value={formData.connectivity} />
            <Input name="resolution" placeholder="Resolution (e.g. 1600 DPI)" onChange={handleChange} value={formData.resolution} />
          </div>
        );
      case "earphone":
        return (
          <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
            <Input name="design" placeholder="Design (In-ear / Over-ear)" onChange={handleChange} value={formData.design} />
            <Input name="batteryLife" placeholder="Battery Life (e.g. 20 hrs)" onChange={handleChange} value={formData.batteryLife} />
          </div>
        );
      case "smartwatch":
        return (
          <div className="spec-fields" style={{ display: "flex", flexDirection: "column" }}>
            <Input name="displaySize" placeholder="Display Size (e.g. 1.5 inch)" onChange={handleChange} value={formData.displaySize} />
            <Input name="displayType" placeholder="Display Type (AMOLED / LCD)" onChange={handleChange} value={formData.displayType} />
            <Input name="batteryRuntime" placeholder="Battery Runtime (e.g. 5 days)" onChange={handleChange} value={formData.batteryRuntime} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            padding: "0 44px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button className="back-btn" onClick={() => { window.location.href = "/seller/dashboard"; }}>
              {"<-"} Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Add New Product
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#cbd5e1", letterSpacing: "0.05em" }}>
            {categoryMeta[category].badge} {categoryMeta[category].label} Selected
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 24px 60px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ width: "100%", maxWidth: 660, animation: "fadeUp 0.45s ease both" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  margin: "0 auto 16px",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                {categoryMeta[category].badge}
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                Add New Product
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>
                Add accessories like chargers, smartwatches, earphones, and mouse products.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="section-card">
                <SectionLabel icon="CAT" text="Product Category" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  {Object.entries(categoryMeta).map(([value, meta]) => (
                    <button
                      key={value}
                      type="button"
                      className={`cat-chip ${category === value ? "active" : ""}`}
                      onClick={() => handleCategoryChange(value)}
                    >
                      <span>{meta.badge}</span>
                      <span>{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-card" style={{ animationDelay: "0.07s" }}>
                <SectionLabel icon="ID" text="Basic Details" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div
                      style={{
                        border: "1.5px dashed #c7d2fe",
                        borderRadius: 10,
                        background: "#f8f9ff",
                        padding: "12px 14px",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>
                        Product ID
                      </div>
                      <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>
                        Auto-generated when you save
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                        Format: {categoryMeta[category].idPrefix}_001, {categoryMeta[category].idPrefix}_002...
                      </div>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input name="title" placeholder="Product Title" onChange={handleChange} value={formData.title} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input name="brand" placeholder="Brand Name" onChange={handleChange} value={formData.brand} />
                  </div>
                  <Input type="number" name="originalPrice" placeholder="Original Price (Rs)" onChange={handleChange} value={formData.originalPrice} />
                  <Input type="number" name="discount" placeholder="Discount (%)" onChange={handleChange} value={formData.discount} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input type="number" name="stock" placeholder="Stock Quantity" onChange={handleChange} value={formData.stock} />
                  </div>
                </div>
              </div>

              <div className="section-card" style={{ animationDelay: "0.14s" }}>
                <SectionLabel icon="SPEC" text={`${categoryMeta[category].label} Specifications`} />
                {renderCategoryFields()}
              </div>

              <div className="upload-box" onClick={() => document.getElementById("fileInput")?.click()}>
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
                    <div style={{ fontSize: 32, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>
                      IMG
                    </div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#6366f1",
                        marginBottom: 6,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
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
                        width: "100%",
                        borderRadius: 12,
                        marginBottom: 12,
                        maxHeight: 220,
                        objectFit: "cover",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      }}
                    />
                    <p style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, marginBottom: 4 }}>
                      {imageFile.name}
                    </p>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Click to change image</span>
                  </>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Add Product to Store
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span
        style={{
          minWidth: 36,
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#4f46e5",
          padding: "0 8px",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: "#1e293b",
          letterSpacing: "0.01em",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function Input({ type = "text", ...props }) {
  return <input type={type} {...props} required className="add-input" />;
}
