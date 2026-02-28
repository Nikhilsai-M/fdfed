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

export const addProduct = async (req, res, next) => {

  try {

    const sellerId = req.user.id;

    const { category, ...data } = req.body;

    let result;

    if (category === "earphone") {
      result = await addEarphone({ ...data, sellerId });
    }

    if (category === "charger") {
      result = await addCharger({ ...data, sellerId });
    }

    if (category === "mouse") {
      result = await addMouse({ ...data, sellerId });
    }

    if (category === "smartwatch") {
      result = await addSmartwatch({ ...data, sellerId });
    }

    res.json({ success: true, product: result });

  } catch (err) {
    next(err);
  }

};

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


export const updateProduct = async (req, res, next) => {

  try {

    const { id } = req.params;
    const { category } = req.body;

    let result;

    if (category === "earphone") {
      result = await updateEarphone(id, req.body);
    }

    if (category === "charger") {
      result = await updateCharger(id, req.body);
    }

    if (category === "mouse") {
      result = await updateMouse(id, req.body);
    }

    if (category === "smartwatch") {
      result = await updateSmartwatch(id, req.body);
    }

    res.json(result);

  } catch (err) {
    next(err);
  }

};


export const deleteProduct = async (req, res, next) => {

  try {

    const { id } = req.params;
    const { category } = req.body;

    let result;

    if (category === "earphone") {
      result = await deleteEarphone(id);
    }

    if (category === "charger") {
      result = await deleteCharger(id);
    }

    if (category === "mouse") {
      result = await deleteMouse(id);
    }

    if (category === "smartwatch") {
      result = await deleteSmartwatch(id);
    }

    res.json(result);

  } catch (err) {
    next(err);
  }

};