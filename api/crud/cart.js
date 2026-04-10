import Cart from "../models/cart.model.js";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

const PRODUCT_LOADERS = {
  phone: async (productId) => Phone.findOne({ id: Number(productId) }).lean(),
  laptop: async (productId) => Laptop.findOne({ id: Number(productId) }).lean(),
  charger: async (productId) => Charger.findOne({ id: String(productId) }).lean(),
  earphone: async (productId) => Earphone.findOne({ id: String(productId) }).lean(),
  mouse: async (productId) => Mouse.findOne({ id: String(productId) }).lean(),
  smartwatch: async (productId) => Smartwatch.findOne({ id: String(productId) }).lean(),
};

function calculateDiscountedPrice(price, discount = 0) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discount || 0);
  return Number((numericPrice - (numericPrice * numericDiscount) / 100).toFixed(2));
}

function normalizePhone(product) {
  const price = Number(product.base_price || 0);
  const discount = Number(product.discount || 0);

  return {
    id: String(product.id),
    productId: String(product.id),
    productType: "phone",
    type: "phone",
    title: `${product.brand} ${product.model}`.trim(),
    category: "phone",
    brand: product.brand,
    model: product.model,
    color: product.color,
    image: product.image,
    seller_id: null,
    price,
    originalPrice: price,
    discount,
    discountPrice: calculateDiscountedPrice(price, discount),
    ram: product.ram,
    rom: product.rom,
    processor: product.processor,
    display: product.display,
    battery: product.battery,
    camera: product.camera,
    os: product.os,
    condition: product.condition,
  };
}

function normalizeLaptop(product) {
  const price = Number(product.base_price || 0);
  const discount = Number(product.discount || 0);

  return {
    id: String(product.id),
    productId: String(product.id),
    productType: "laptop",
    type: "laptop",
    title: `${product.brand} ${product.series}`.trim(),
    category: "laptop",
    brand: product.brand,
    model: product.series,
    image: product.image,
    seller_id: null,
    price,
    originalPrice: price,
    discount,
    discountPrice: calculateDiscountedPrice(price, discount),
    ram: product.ram,
    storage: `${product.storage_type} ${product.storage_capacity}`.trim(),
    processor: `${product.processor_name} ${product.processor_generation || ""}`.trim(),
    display: `${product.display_size}\"`,
    os: product.os,
    weight: `${product.weight} kg`,
    condition: product.condition,
  };
}

function normalizeAccessory(productType, product) {
  const price = Number(product.originalPrice || 0);
  const discount = Number(product.discount || 0);

  const base = {
    id: String(product.id),
    productId: String(product.id),
    productType,
    category: productType,
    title: product.title,
    brand: product.brand,
    image: product.image,
    seller_id: product.sellerId ? String(product.sellerId) : null,
    price,
    originalPrice: price,
    discount,
    discountPrice: calculateDiscountedPrice(price, discount),
    stock: Number(product.stock || 0),
  };

  if (productType === "charger") {
    return {
      ...base,
      type: product.type,
      wattage: product.wattage,
      outputCurrent: product.outputCurrent,
    };
  }

  if (productType === "earphone") {
    return {
      ...base,
      design: product.design,
      batteryLife: product.batteryLife,
    };
  }

  if (productType === "mouse") {
    return {
      ...base,
      type: product.type,
      connectivity: product.connectivity,
      resolution: product.resolution,
    };
  }

  return {
    ...base,
    displaySize: product.displaySize,
    displayType: product.displayType,
    batteryRuntime: product.batteryRuntime,
  };
}

function normalizeCartItem(productType, product) {
  if (productType === "phone") return normalizePhone(product);
  if (productType === "laptop") return normalizeLaptop(product);
  return normalizeAccessory(productType, product);
}

async function fetchProduct(productType, productId) {
  const loader = PRODUCT_LOADERS[productType];
  if (!loader) {
    throw new Error("Unsupported product type");
  }

  const product = await loader(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (["charger", "earphone", "mouse", "smartwatch"].includes(productType)) {
    if (product.isActive === false) {
      throw new Error("Product is unavailable");
    }

    if (Number(product.stock || 0) < 1) {
      throw new Error("Product is out of stock");
    }
  }

  return product;
}

function ensureValidQuantity(productType, product, quantity) {
  const numericQuantity = Number(quantity || 1);

  if (!Number.isFinite(numericQuantity) || numericQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  if (["phone", "laptop"].includes(productType) && numericQuantity > 1) {
    throw new Error(`Only one ${productType} can be added to cart`);
  }

  if (["charger", "earphone", "mouse", "smartwatch"].includes(productType)) {
    const stock = Number(product.stock || 0);
    if (numericQuantity > stock) {
      throw new Error("Requested quantity exceeds available stock");
    }
  }

  return numericQuantity;
}

function buildCartResponse(cart) {
  const items = (cart?.items || []).map((entry) => ({
    ...entry.item,
    quantity: entry.quantity,
    productType: entry.productType,
    productId: entry.productId,
    seller_id: entry.seller_id || entry.item?.seller_id || null,
  }));

  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.discountPrice ?? item.price ?? 0);
    return sum + unitPrice * Number(item.quantity || 0);
  }, 0);

  return {
    items,
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    updatedAt: cart?.updated_at || null,
  };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    cart = await Cart.create({ user_id: userId, items: [] });
  }
  return cart;
}

export async function getCartByUserId(userId) {
  const cart = await getOrCreateCart(userId);
  return buildCartResponse(cart);
}

export async function addItemToCart(userId, productType, productId, quantity = 1) {
  const normalizedType = String(productType || "").toLowerCase();
  const normalizedId = String(productId || "").trim();

  if (!normalizedType || !normalizedId) {
    throw new Error("productType and productId are required");
  }

  const product = await fetchProduct(normalizedType, normalizedId);
  const cart = await getOrCreateCart(userId);
  const existingIndex = cart.items.findIndex(
    (item) => item.productType === normalizedType && item.productId === normalizedId
  );

  const nextQuantity = existingIndex >= 0
    ? Number(cart.items[existingIndex].quantity || 0) + Number(quantity || 1)
    : Number(quantity || 1);

  const validatedQuantity = ensureValidQuantity(normalizedType, product, nextQuantity);
  const normalizedItem = normalizeCartItem(normalizedType, product);

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity = validatedQuantity;
    cart.items[existingIndex].seller_id = normalizedItem.seller_id || null;
    cart.items[existingIndex].item = normalizedItem;
  } else {
    cart.items.push({
      productType: normalizedType,
      productId: normalizedId,
      quantity: validatedQuantity,
      seller_id: normalizedItem.seller_id || null,
      item: normalizedItem,
    });
  }

  cart.updated_at = new Date();
  await cart.save();
  return buildCartResponse(cart);
}

export async function updateCartItemQuantity(userId, productType, productId, quantity) {
  const normalizedType = String(productType || "").toLowerCase();
  const normalizedId = String(productId || "").trim();
  const requestedQuantity = Number(quantity);

  if (!normalizedType || !normalizedId || !Number.isFinite(requestedQuantity)) {
    throw new Error("A valid product type, product id, and quantity are required");
  }

  const cart = await getOrCreateCart(userId);
  const existingIndex = cart.items.findIndex(
    (item) => item.productType === normalizedType && item.productId === normalizedId
  );

  if (existingIndex === -1) {
    throw new Error("Cart item not found");
  }

  if (requestedQuantity <= 0) {
    cart.items.splice(existingIndex, 1);
  } else {
    const product = await fetchProduct(normalizedType, normalizedId);
    const validatedQuantity = ensureValidQuantity(normalizedType, product, requestedQuantity);
    const normalizedItem = normalizeCartItem(normalizedType, product);

    cart.items[existingIndex].quantity = validatedQuantity;
    cart.items[existingIndex].seller_id = normalizedItem.seller_id || null;
    cart.items[existingIndex].item = normalizedItem;
  }

  cart.updated_at = new Date();
  await cart.save();
  return buildCartResponse(cart);
}

export async function removeItemFromCart(userId, productType, productId) {
  const normalizedType = String(productType || "").toLowerCase();
  const normalizedId = String(productId || "").trim();
  const cart = await getOrCreateCart(userId);

  cart.items = cart.items.filter(
    (item) => !(item.productType === normalizedType && item.productId === normalizedId)
  );

  cart.updated_at = new Date();
  await cart.save();
  return buildCartResponse(cart);
}

export async function clearCartByUserId(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.updated_at = new Date();
  await cart.save();
  return buildCartResponse(cart);
}
