import Cart from "../models/cart.model.js";
import { getPhoneById } from "../crud/phones.js";
import { getLaptopById } from "../crud/laptops.js";
import { getChargerById } from "../crud/chargers.js";
import { getEarphoneById } from "../crud/earphones.js";
import { getMouseById } from "../crud/mouses.js";
import { getSmartwatchById } from "../crud/smartwatches.js";

const PRODUCT_TYPES = new Set([
  "phone",
  "laptop",
  "charger",
  "earphone",
  "mouse",
  "smartwatch",
]);

const productFetchers = {
  phone: getPhoneById,
  laptop: getLaptopById,
  charger: getChargerById,
  earphone: getEarphoneById,
  mouse: getMouseById,
  smartwatch: getSmartwatchById,
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function computeUnitPrice(originalPrice, discount) {
  const normalizedOriginalPrice = toNumber(originalPrice);
  const normalizedDiscount = toNumber(discount);
  return Number(
    (normalizedOriginalPrice - (normalizedOriginalPrice * normalizedDiscount) / 100).toFixed(2)
  );
}

function normalizeType(productType) {
  return String(productType || "").trim().toLowerCase();
}

export function isSupportedCartProductType(productType) {
  return PRODUCT_TYPES.has(normalizeType(productType));
}

export async function getProductForCart(productType, productId) {
  const normalizedType = normalizeType(productType);
  const fetcher = productFetchers[normalizedType];

  if (!fetcher) {
    return null;
  }

  return fetcher(productId);
}

export function buildCartSnapshot(productType, product) {
  const normalizedType = normalizeType(productType);

  if (!product) {
    return null;
  }

  if (normalizedType === "phone") {
    const originalPrice = toNumber(product.pricing?.basePrice);
    const discount = toNumber(product.pricing?.discount);

    return {
      sellerId: product.sellerId || product.seller_id || null,
      originalPrice,
      discount,
      unitPrice: computeUnitPrice(originalPrice, discount),
      stock: 1,
      available: true,
      snapshot: {
        title: `${product.brand} ${product.model}`.trim(),
        brand: product.brand,
        model: product.model,
        color: product.color,
        image: product.image,
        ram: product.ram,
        rom: product.rom,
        processor: product.specs?.processor || "",
        display: product.specs?.display || "",
        battery: product.specs?.battery || "",
        camera: product.specs?.camera || "",
        os: product.specs?.os || "",
        network: product.specs?.network || "",
        weight: product.specs?.weight || "",
        condition: product.condition,
      },
    };
  }

  if (normalizedType === "laptop") {
    const originalPrice = toNumber(product.pricing?.basePrice);
    const discount = toNumber(product.pricing?.discount);
    const processorName = product.processor?.name || "";
    const processorGeneration = product.processor?.generation || "";
    const storageType = product.memory?.storage?.type || "";
    const storageCapacity = product.memory?.storage?.capacity || "";

    return {
      sellerId: product.sellerId || product.seller_id || null,
      originalPrice,
      discount,
      unitPrice: computeUnitPrice(originalPrice, discount),
      stock: 1,
      available: true,
      snapshot: {
        title: `${product.brand} ${product.series}`.trim(),
        brand: product.brand,
        series: product.series,
        image: product.image,
        processor: `${processorName} ${processorGeneration}`.trim(),
        ram: product.memory?.ram || "",
        storage: `${storageType} ${storageCapacity}`.trim(),
        display: product.displaysize ? `${product.displaysize}"` : "",
        os: product.os,
        weight: product.weight ? `${product.weight} kg` : "",
        condition: product.condition,
      },
    };
  }

  const originalPrice = toNumber(product.originalPrice);
  const discount = toNumber(product.discount);
  const baseSnapshot = {
    sellerId: product.sellerId || product.seller_id || null,
    originalPrice,
    discount,
    unitPrice: computeUnitPrice(originalPrice, discount),
    stock: product.stock == null ? null : toNumber(product.stock, 0),
    available: product.stock == null ? true : toNumber(product.stock, 0) > 0,
    snapshot: {
      title: product.title,
      brand: product.brand,
      image: product.image,
    },
  };

  if (normalizedType === "charger") {
    baseSnapshot.snapshot.wattage = product.wattage;
    baseSnapshot.snapshot.connectorType = product.type;
    baseSnapshot.snapshot.outputCurrent = product.outputCurrent;
  }

  if (normalizedType === "earphone") {
    baseSnapshot.snapshot.design = product.design;
    baseSnapshot.snapshot.batteryLife = product.batteryLife;
  }

  if (normalizedType === "mouse") {
    baseSnapshot.snapshot.mouseType = product.type;
    baseSnapshot.snapshot.connectivity = product.connectivity;
    baseSnapshot.snapshot.resolution = product.resolution;
  }

  if (normalizedType === "smartwatch") {
    baseSnapshot.snapshot.displaySize = product.displaySize;
    baseSnapshot.snapshot.displayType = product.displayType;
    baseSnapshot.snapshot.batteryRuntime = product.batteryRuntime;
  }

  return baseSnapshot;
}

function serializeCartItem(item) {
  return {
    itemId: item._id.toString(),
    type: item.productType,
    productId: item.productId,
    seller_id: item.sellerId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    price: item.unitPrice,
    originalPrice: item.originalPrice,
    discount: item.discount,
    stock: item.stock,
    available: item.available,
    ...item.snapshot,
  };
}

export function serializeCart(cart) {
  const items = (cart?.items || []).map(serializeCartItem);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)
  );

  return {
    userId: cart?.user_id || null,
    items,
    cartCount,
    subtotal,
  };
}

export async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user_id: userId });

  if (!cart) {
    cart = await Cart.create({ user_id: userId, items: [] });
  }

  return cart;
}

export async function refreshCart(cart) {
  let hasChanges = false;
  const refreshedItems = [];

  for (const item of cart.items) {
    const product = await getProductForCart(item.productType, item.productId);

    if (!product) {
      hasChanges = true;
      continue;
    }

    const freshSnapshot = buildCartSnapshot(item.productType, product);

    if (!freshSnapshot) {
      hasChanges = true;
      continue;
    }

    item.sellerId = freshSnapshot.sellerId;
    item.unitPrice = freshSnapshot.unitPrice;
    item.originalPrice = freshSnapshot.originalPrice;
    item.discount = freshSnapshot.discount;
    item.stock = freshSnapshot.stock;
    item.available = freshSnapshot.available;
    item.snapshot = freshSnapshot.snapshot;

    if (typeof freshSnapshot.stock === "number" && item.quantity > freshSnapshot.stock) {
      if (freshSnapshot.stock <= 0) {
        hasChanges = true;
        continue;
      }

      item.quantity = freshSnapshot.stock;
      hasChanges = true;
    }

    refreshedItems.push(item);
  }

  if (refreshedItems.length !== cart.items.length) {
    cart.items = refreshedItems;
    hasChanges = true;
  }

  if (hasChanges) {
    await cart.save();
  }

  return cart;
}

export async function clearCartByUserId(userId) {
  await Cart.updateOne({ user_id: userId }, { $set: { items: [] } }, { upsert: true });
}
