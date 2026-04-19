import {
  addEarphone,
  addCharger,
  addMouse,
  addSmartwatch,
  getSellerEarphones,
  getSellerChargers,
  getSellerMouses,
  getSellerSmartwatches,
  updateEarphone,
  updateCharger,
  updateMouse,
  updateSmartwatch,
  deleteEarphone,
  deleteCharger,
  deleteMouse,
  deleteSmartwatch
} from "../crud/inventory.js";
import { matchRequests } from "../services/requestMatcher.service.js";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary
} from "../utils/cloudinary.js";
import { invalidateCatalogCaches } from "../config/redis.js";
import { generateAccessoryProductId } from "../services/productId.service.js";

/* ===============================
   ADD PRODUCT
=============================== */
export const addProduct = async (req, res, next) => {
  let uploadedPublicId;

  try {

    const sellerId = req.user.id;
    const { category, id: _ignoredId, ...data } = req.body;
    const normalizedCategory = String(category || "").trim().toLowerCase();

    if (!normalizedCategory) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (!["earphone", "charger", "mouse", "smartwatch"].includes(normalizedCategory)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Upload image if provided
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        `seller_${sellerId}`
      );

      data.image = uploaded.secure_url;
      data.public_id = uploaded.public_id;
      uploadedPublicId = uploaded.public_id;
    }

    let result;
    const generatedId = await generateAccessoryProductId(normalizedCategory);

    if (normalizedCategory === "earphone") {
      result = await addEarphone({ ...data, id: generatedId, sellerId });
    }

    if (normalizedCategory === "charger") {
      result = await addCharger({ ...data, id: generatedId, sellerId });
    }

    if (normalizedCategory === "mouse") {
      result = await addMouse({ ...data, id: generatedId, sellerId });
    }

    if (normalizedCategory === "smartwatch") {
      result = await addSmartwatch({ ...data, id: generatedId, sellerId });
    }

    if (!result?.success) {
      if (uploadedPublicId) {
        await deleteFromCloudinary(uploadedPublicId);
      }
      return res.status(400).json({
        success: false,
        message: result?.message || "Unable to add product"
      });
    }

    if (result?.success) {
      await matchRequests(normalizedCategory, {
        id: result.id,
        brand: data.brand,
        model: data.model || data.title || "",
      });
      await invalidateCatalogCaches();
    }
    res.json({ success: true, product: result });

  } catch (err) {
    if (uploadedPublicId) {
      await deleteFromCloudinary(uploadedPublicId);
    }
    next(err);
  }
};

/* ===============================
   GET SELLER PRODUCTS
=============================== */
export const getSellerProducts = async (req, res, next) => {
  try {

    const sellerId = req.user.id;

    const earphones = await getSellerEarphones(sellerId);
    const chargers = await getSellerChargers(sellerId);
    const mouses = await getSellerMouses(sellerId);
    const watches = await getSellerSmartwatches(sellerId);

    const products = [
      ...earphones,
      ...chargers,
      ...mouses,
      ...watches
    ];

    res.json({
      success: true,
      products
    });

  } catch (err) {
    next(err);
  }
};

/* ===============================
   UPDATE PRODUCT
=============================== */
export const updateProduct = async (req, res, next) => {
  try {

    const sellerId = req.user.id;
    const { id } = req.params;
    const { category } = req.body;

    let updateData = { ...req.body };

    // If new image uploaded
    if (req.file) {

      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        `seller_${sellerId}`
      );

      updateData.image = uploaded.secure_url;
      updateData.public_id = uploaded.public_id;
    }

    let result;

    if (category === "earphone") {
      result = await updateEarphone(id, updateData, sellerId);
    }

    if (category === "charger") {
      result = await updateCharger(id, updateData, sellerId);
    }

    if (category === "mouse") {
      result = await updateMouse(id, updateData, sellerId);
    }

    if (category === "smartwatch") {
      result = await updateSmartwatch(id, updateData, sellerId);
    }

    await invalidateCatalogCaches();
      
    res.json(result);

  } catch (err) {
    next(err);
  }
};

/* ===============================
   DELETE PRODUCT (SOFT DELETE)
=============================== */
export const deleteProduct = async (req, res, next) => {
  try {

    const sellerId = req.user.id;
    const { id } = req.params;
    const { category } = req.body;

    let result;

    if (category === "earphone") {
      result = await deleteEarphone(id, sellerId);
    }

    if (category === "charger") {
      result = await deleteCharger(id, sellerId);
    }

    if (category === "mouse") {
      result = await deleteMouse(id, sellerId);
    }

    if (category === "smartwatch") {
      result = await deleteSmartwatch(id, sellerId);
    }

    await invalidateCatalogCaches();
      
    res.json(result);

  } catch (err) {
    next(err);
  }
};

