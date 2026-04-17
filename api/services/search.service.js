import axios from "axios";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Earphone from "../models/earphone.model.js";
import Charger from "../models/charger.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

const COLLECTION_LIMIT = 20;
const DEFAULT_SOLR_CORE = "smart_exchange";
const DEFAULT_SOLR_URL = "http://127.0.0.1:8983/solr";

export const CATEGORY_TERMS = {
  phone: ["phone", "phones", "mobile", "mobiles"],
  laptop: ["laptop", "laptops", "notebook", "notebooks"],
  earphone: ["earphone", "earphones", "earbud", "earbuds", "headphone", "headphones"],
  charger: ["charger", "chargers", "adapter", "adapters"],
  mouse: ["mouse", "mouses", "mice"],
  smartwatch: ["smartwatch", "smartwatches", "watch", "watches"],
};

const PRODUCT_COLLECTIONS = ["phone", "laptop", "earphone", "charger", "mouse", "smartwatch"];

export const buildTextQuery = (term) => ({ $text: { $search: term } });
export const buildTextProjection = () => ({ score: { $meta: "textScore" } });
export const buildTextSort = () => ({ score: { $meta: "textScore" }, created_at: -1, _id: -1 });
export const isCategoryQuery = (term, values) => values.includes(String(term || "").toLowerCase());
export function getSearchCacheKey(term) { return `search:${String(term || "").trim().toLowerCase()}`; }
export function normalizeSearchTerm(term) { return String(term || "").trim(); }

export function getSearchEngine() {
  return process.env.SEARCH_ENGINE === "solr" ? "solr" : "mongo";
}

export function isSolrEnabled() {
  return getSearchEngine() === "solr";
}

export function getSolrBaseUrl() {
  return (process.env.SOLR_URL || DEFAULT_SOLR_URL).replace(/\/$/, "");
}

export function getSolrCore() {
  return process.env.SOLR_CORE || DEFAULT_SOLR_CORE;
}

export function getSolrSelectUrl() {
  return `${getSolrBaseUrl()}/${getSolrCore()}/select`;
}

export function getSolrUpdateUrl() {
  return `${getSolrBaseUrl()}/${getSolrCore()}/update`;
}

export function escapeSolrTerm(term) {
  return String(term || "").replace(/([+\-!(){}\[\]^"~*?:\\/]|&&|\|\|)/g, "\\$1");
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function computeDiscountedPrice(price, discount) {
  return roundMoney(Number(price || 0) * (1 - Number(discount || 0) / 100));
}

function mapPhone(phone) {
  return {
    id: String(phone.id),
    type: "phone",
    title: `${phone.brand} ${phone.model}`.trim(),
    brand: phone.brand,
    model: phone.model,
    image: phone.image,
    price: Number(phone.base_price || 0),
    discount: Number(phone.discount || 0),
    condition: phone.condition,
    finalPrice: computeDiscountedPrice(phone.base_price, phone.discount),
    score: Number(phone.score || 0),
  };
}

function mapLaptop(laptop) {
  return {
    id: String(laptop.id),
    type: "laptop",
    title: `${laptop.brand} ${laptop.series}`.trim(),
    brand: laptop.brand,
    series: laptop.series,
    image: laptop.image,
    price: Number(laptop.base_price || 0),
    discount: Number(laptop.discount || 0),
    condition: laptop.condition,
    finalPrice: computeDiscountedPrice(laptop.base_price, laptop.discount),
    score: Number(laptop.score || 0),
  };
}

function mapAccessory(type, item) {
  return {
    id: String(item.id),
    type,
    title: item.title,
    brand: item.brand,
    image: item.image,
    price: Number(item.originalPrice || 0),
    discount: Number(item.discount || 0),
    finalPrice: computeDiscountedPrice(item.originalPrice, item.discount),
    score: Number(item.score || 0),
  };
}

function toMongoResults({ phones, laptops, earphones, chargers, mouses, smartwatches }) {
  return [
    ...phones.map(mapPhone),
    ...laptops.map(mapLaptop),
    ...earphones.map((item) => mapAccessory("earphone", item)),
    ...chargers.map((item) => mapAccessory("charger", item)),
    ...mouses.map((item) => mapAccessory("mouse", item)),
    ...smartwatches.map((item) => mapAccessory("smartwatch", item)),
  ].sort((a, b) => (b.score || 0) - (a.score || 0));
}

export async function searchProductsWithMongo(searchTerm) {
  const lowerTerm = searchTerm.toLowerCase();
  const phoneFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.phone) ? {} : buildTextQuery(searchTerm);
  const laptopFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.laptop) ? {} : buildTextQuery(searchTerm);
  const earphoneFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.earphone) ? { isActive: true } : { isActive: true, ...buildTextQuery(searchTerm) };
  const chargerFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.charger) ? { isActive: true } : { isActive: true, ...buildTextQuery(searchTerm) };
  const mouseFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.mouse) ? { isActive: true } : { isActive: true, ...buildTextQuery(searchTerm) };
  const smartwatchFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.smartwatch) ? { isActive: true } : { isActive: true, ...buildTextQuery(searchTerm) };

  const genericProjection = {};
  const genericSort = { created_at: -1, _id: -1 };

  const [phones, laptops, earphones, chargers, mouses, smartwatches] = await Promise.all([
    Phone.find(phoneFilter, phoneFilter.$text ? buildTextProjection() : genericProjection).sort(phoneFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
    Laptop.find(laptopFilter, laptopFilter.$text ? buildTextProjection() : genericProjection).sort(laptopFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
    Earphone.find(earphoneFilter, earphoneFilter.$text ? buildTextProjection() : genericProjection).sort(earphoneFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
    Charger.find(chargerFilter, chargerFilter.$text ? buildTextProjection() : genericProjection).sort(chargerFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
    Mouse.find(mouseFilter, mouseFilter.$text ? buildTextProjection() : genericProjection).sort(mouseFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
    Smartwatch.find(smartwatchFilter, smartwatchFilter.$text ? buildTextProjection() : genericProjection).sort(smartwatchFilter.$text ? buildTextSort() : genericSort).limit(COLLECTION_LIMIT).lean(),
  ]);

  return {
    engine: "mongo-text",
    results: toMongoResults({ phones, laptops, earphones, chargers, mouses, smartwatches }),
  };
}

export function buildSolrQuery(searchTerm) {
  const lowerTerm = searchTerm.toLowerCase();
  for (const productType of PRODUCT_COLLECTIONS) {
    if (isCategoryQuery(lowerTerm, CATEGORY_TERMS[productType])) {
      return `type:${productType}`;
    }
  }

  const escaped = escapeSolrTerm(searchTerm);
  return `text:${escaped}~2 OR title:${escaped}~2 OR brand:${escaped}~2`;
}

export function buildSolrDocument(type, product) {
  const base = {
    id: `${type}:${product.id}`,
    productId: String(product.id),
    type,
    brand: product.brand || "",
    image: product.image || "",
    created_at: new Date(product.created_at || Date.now()).toISOString(),
  };

  if (type === "phone") {
    return {
      ...base,
      title: `${product.brand} ${product.model}`.trim(),
      condition: product.condition || "",
      price: Number(product.base_price || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.base_price, product.discount),
      text: [product.brand, product.model, product.color, product.processor, product.os, product.ram, product.rom].filter(Boolean).join(" "),
    };
  }

  if (type === "laptop") {
    return {
      ...base,
      title: `${product.brand} ${product.series}`.trim(),
      condition: product.condition || "",
      price: Number(product.base_price || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.base_price, product.discount),
      text: [product.brand, product.series, product.processor_name, product.processor_generation, product.os, product.ram, product.storage_type, product.storage_capacity].filter(Boolean).join(" "),
    };
  }

  return {
    ...base,
    title: product.title || "",
    condition: "",
    price: Number(product.originalPrice || 0),
    discount: Number(product.discount || 0),
    finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
    text: [product.title, product.brand, product.type, product.design, product.wattage, product.displayType, product.connectivity, product.batteryLife, product.outputCurrent, product.resolution, product.batteryRuntime].filter(Boolean).join(" "),
  };
}

function mapSolrDoc(doc) {
  return {
    id: doc.productId,
    type: doc.type,
    title: doc.title,
    brand: doc.brand,
    image: doc.image,
    price: Number(doc.price || 0),
    discount: Number(doc.discount || 0),
    condition: doc.condition || undefined,
    finalPrice: Number(doc.finalPrice || 0),
    score: Number(doc.score || 0),
  };
}

export async function searchProductsWithSolr(searchTerm) {
  const response = await axios.get(getSolrSelectUrl(), {
    params: {
      q: buildSolrQuery(searchTerm),
      defType: "edismax",
      qf: "text^4 title^5 brand^3 type^2",
      rows: COLLECTION_LIMIT * PRODUCT_COLLECTIONS.length,
      fl: "productId,type,title,brand,image,price,discount,finalPrice,condition,score",
      sort: "score desc, created_at desc",
      wt: "json",
    },
    timeout: Number(process.env.SOLR_TIMEOUT_MS || 4000),
  });

  const docs = response.data?.response?.docs || [];
  return {
    engine: "solr",
    results: docs.map(mapSolrDoc),
  };
}

async function loadAllSearchableProducts() {
  const [phones, laptops, earphones, chargers, mouses, smartwatches] = await Promise.all([
    Phone.find().lean(),
    Laptop.find().lean(),
    Earphone.find({ isActive: true }).lean(),
    Charger.find({ isActive: true }).lean(),
    Mouse.find({ isActive: true }).lean(),
    Smartwatch.find({ isActive: true }).lean(),
  ]);

  return [
    ...phones.map((item) => buildSolrDocument("phone", item)),
    ...laptops.map((item) => buildSolrDocument("laptop", item)),
    ...earphones.map((item) => buildSolrDocument("earphone", item)),
    ...chargers.map((item) => buildSolrDocument("charger", item)),
    ...mouses.map((item) => buildSolrDocument("mouse", item)),
    ...smartwatches.map((item) => buildSolrDocument("smartwatch", item)),
  ];
}

export async function syncMongoProductsToSolr() {
  if (!isSolrEnabled()) {
    return { synced: false, reason: "solr-disabled", count: 0 };
  }

  const docs = await loadAllSearchableProducts();
  await axios.post(`${getSolrUpdateUrl()}?commit=true`, docs, {
    headers: { "Content-Type": "application/json" },
    timeout: Number(process.env.SOLR_TIMEOUT_MS || 8000),
  });

  return { synced: true, count: docs.length };
}

let queuedSync = null;
export function queueSolrSync() {
  if (!isSolrEnabled()) {
    return null;
  }

  if (queuedSync) {
    return queuedSync;
  }

  queuedSync = new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const result = await syncMongoProductsToSolr();
        resolve(result);
      } catch (error) {
        console.warn("SOLR_SYNC_ERROR", error.message);
        resolve({ synced: false, reason: error.message, count: 0 });
      } finally {
        queuedSync = null;
      }
    }, Number(process.env.SOLR_SYNC_DEBOUNCE_MS || 1500));
  });

  return queuedSync;
}

export async function searchCatalog(searchTerm) {
  if (!isSolrEnabled()) {
    return searchProductsWithMongo(searchTerm);
  }

  try {
    return await searchProductsWithSolr(searchTerm);
  } catch (error) {
    console.warn("SOLR_SEARCH_FALLBACK", error.message);
    const fallback = await searchProductsWithMongo(searchTerm);
    return {
      ...fallback,
      engine: `${fallback.engine}:fallback`,
    };
  }
}
