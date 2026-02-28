import { useState } from "react";
import axios from "axios";

export default function AddProduct() {

  const token = localStorage.getItem("sellerToken");

  const [category, setCategory] = useState("charger");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
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
    batteryRuntime: ""
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

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(
        "http://localhost:3000/api/seller/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Product Added Successfully!");
      window.location.href = "/seller/dashboard";

    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const renderCategoryFields = () => {

    switch (category) {

      case "charger":
        return (
          <>
            <Input name="wattage" placeholder="Wattage (e.g. 20W)" onChange={handleChange} />
            <Input name="type" placeholder="Type (USB C / Lightning)" onChange={handleChange} />
            <Input name="outputCurrent" placeholder="Output Current (e.g. 3A)" onChange={handleChange} />
          </>
        );

      case "mouse":
        return (
          <>
            <Input name="type" placeholder="Mouse Type (Gaming / Office)" onChange={handleChange} />
            <Input name="connectivity" placeholder="Connectivity (Wired / Wireless)" onChange={handleChange} />
            <Input name="resolution" placeholder="Resolution (e.g. 1600 DPI)" onChange={handleChange} />
          </>
        );

      case "earphone":
        return (
          <>
            <Input name="design" placeholder="Design (In-ear / Over-ear)" onChange={handleChange} />
            <Input name="batteryLife" placeholder="Battery Life (e.g. 20 hrs)" onChange={handleChange} />
          </>
        );

      case "smartwatch":
        return (
          <>
            <Input name="displaySize" placeholder="Display Size (e.g. 1.5 inch)" onChange={handleChange} />
            <Input name="displayType" placeholder="Display Type (AMOLED / LCD)" onChange={handleChange} />
            <Input name="batteryRuntime" placeholder="Battery Runtime (e.g. 5 days)" onChange={handleChange} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Add New Product</h2>

        <form onSubmit={handleSubmit}>

          {/* Category Selector */}
          <div style={styles.section}>
            <label style={styles.label}>Product Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="charger">Charger</option>
              <option value="mouse">Mouse</option>
              <option value="earphone">Earphone</option>
              <option value="smartwatch">Smartwatch</option>
            </select>
          </div>

          {/* Basic Details */}
          <div style={styles.section}>
            <label style={styles.label}>Basic Details</label>
            <Input name="id" placeholder="Product ID" onChange={handleChange} />
            <Input name="title" placeholder="Product Title" onChange={handleChange} />
            <Input name="brand" placeholder="Brand Name" onChange={handleChange} />
            <Input type="number" name="originalPrice" placeholder="Original Price" onChange={handleChange} />
            <Input type="number" name="discount" placeholder="Discount %" onChange={handleChange} />
            <Input type="number" name="stock" placeholder="Stock Quantity" onChange={handleChange} />
          </div>

          {/* Category Specific */}
          <div style={styles.section}>
            <label style={styles.label}>Specifications</label>
            {renderCategoryFields()}
          </div>

          {/* Image Upload */}
         <div
  style={styles.uploadBox}
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
      <div style={styles.uploadIcon}>📤</div>
      <p style={styles.uploadText}>Click to Upload Product Image</p>
      <span style={styles.uploadSubText}>
        PNG, JPG up to 5MB
      </span>
    </>
  ) : (
    <>
      <img
        src={URL.createObjectURL(imageFile)}
        alt="Preview"
        style={styles.preview}
      />
      <p style={styles.fileName}>{imageFile.name}</p>
      <span style={styles.changeText}>Click to change image</span>
    </>
  )}
</div>

          <button type="submit" style={styles.button}>
            Add Product
          </button>

        </form>

      </div>
    </div>
  );
}

/* Reusable Input */
const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    required
    style={styles.input}
  />
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