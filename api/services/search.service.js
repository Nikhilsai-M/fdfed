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
const SOLR_RETRY_ATTEMPTS = Math.max(1, Number.parseInt(process.env.SOLR_RETRY_ATTEMPTS || "8", 10));
const SOLR_RETRY_DELAY_MS = Math.max(250, Number.parseInt(process.env.SOLR_RETRY_DELAY_MS || "1500", 10));

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

export function getSolrJsonDocsUpdateUrl() {
  return `${getSolrUpdateUrl()}/json/docs`;
}

export function getSolrHealthUrl() {
  return `${getSolrBaseUrl()}/admin/cores`;
}

export function getSolrSchemaUrl() {
  return `${getSolrBaseUrl()}/${getSolrCore()}/schema`;
}

const SOLR_SCHEMA_FIELDS = [
  { name: "id", type: "string", indexed: true, stored: true, multiValued: false, required: true },
  { name: "productId", type: "string", indexed: true, stored: true, multiValued: false },
  { name: "type", type: "string", indexed: true, stored: true, multiValued: false },
  { name: "brand", type: "text_general", indexed: true, stored: true, multiValued: false },
  { name: "title", type: "text_general", indexed: true, stored: true, multiValued: false },
  { name: "image", type: "string", indexed: false, stored: true, multiValued: false },
  { name: "price", type: "pdouble", indexed: true, stored: true, multiValued: false },
  { name: "discount", type: "pdouble", indexed: true, stored: true, multiValued: false },
  { name: "finalPrice", type: "pdouble", indexed: true, stored: true, multiValued: false },
  { name: "condition", type: "text_general", indexed: true, stored: true, multiValued: false },
  { name: "created_at", type: "pdate", indexed: true, stored: true, multiValued: false },
  { name: "text", type: "text_general", indexed: true, stored: true, multiValued: false },
];

export function escapeSolrTerm(term) {
  return String(term || "").replace(/([+\-!(){}\[\]^"~*?:\\/]|&&|\|\|)/g, "\\$1");
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function computeDiscountedPrice(price, discount) {
  return roundMoney(Number(price || 0) * (1 - Number(discount || 0) / 100));
}

function joinSearchTerms(values = []) {
  return values.filter(Boolean).join(" ");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableSolrError(error) {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.error?.msg || error?.message || "");

  return (
    error?.code === "ECONNREFUSED" ||
    error?.code === "ECONNRESET" ||
    error?.code === "ETIMEDOUT" ||
    status === 404 ||
    status === 503 ||
    message.toLowerCase().includes("core") ||
    message.toLowerCase().includes("unavailable") ||
    message.toLowerCase().includes("not found")
  );
}

async function solrRequestWithRetry(requestFactory, options = {}) {
  const attempts = options.attempts || SOLR_RETRY_ATTEMPTS;
  const delayMs = options.delayMs || SOLR_RETRY_DELAY_MS;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await requestFactory();
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isRetryableSolrError(error)) {
        throw error;
      }

      await sleep(delayMs);
    }
  }

  throw lastError;
}

function normalizeSchemaField(field = {}) {
  return {
    name: field.name,
    type: field.type,
    indexed: field.indexed !== false,
    stored: field.stored !== false,
    multiValued: field.multiValued === true,
    required: field.required === true,
  };
}

function shouldReplaceSolrField(existingField, expectedField) {
  const current = normalizeSchemaField(existingField);
  const expected = normalizeSchemaField(expectedField);

  return (
    current.type !== expected.type ||
    current.indexed !== expected.indexed ||
    current.stored !== expected.stored ||
    current.multiValued !== expected.multiValued ||
    current.required !== expected.required
  );
}

async function mutateSolrSchema(operation, field) {
  await solrRequestWithRetry(() =>
    axios.post(
      getSolrSchemaUrl(),
      { [operation]: field },
      {
        headers: { "Content-Type": "application/json" },
        timeout: Number(process.env.SOLR_TIMEOUT_MS || 8000),
      }
    )
  );
}

export async function ensureSolrSchema() {
  const response = await solrRequestWithRetry(() =>
    axios.get(`${getSolrSchemaUrl()}/fields`, {
      params: { wt: "json" },
      timeout: Number(process.env.SOLR_TIMEOUT_MS || 4000),
    })
  );

  const existingFields = new Map(
    (response.data?.fields || []).map((field) => [field.name, field])
  );

  for (const field of SOLR_SCHEMA_FIELDS) {
    const existing = existingFields.get(field.name);

    if (!existing) {
      await mutateSolrSchema("add-field", field);
      continue;
    }

    if (shouldReplaceSolrField(existing, field)) {
      await mutateSolrSchema("replace-field", field);
    }
  }
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
      text: joinSearchTerms([product.brand, product.model, product.color, product.processor, product.os, product.ram, product.rom]),
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
      text: joinSearchTerms([product.brand, product.series, product.processor_name, product.processor_generation, product.os, product.ram, product.storage_type, product.storage_capacity]),
    };
  }

  if (type === "earphone") {
    return {
      ...base,
      title: product.title || "",
      condition: "",
      price: Number(product.originalPrice || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
      text: joinSearchTerms([
        product.title,
        product.brand,
        product.design,
        product.batteryLife,
      ]),
    };
  }

  if (type === "charger") {
    return {
      ...base,
      title: product.title || "",
      condition: "",
      price: Number(product.originalPrice || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
      text: joinSearchTerms([
        product.title,
        product.brand,
        product.type,
        product.wattage,
        product.outputCurrent,
      ]),
    };
  }

  if (type === "mouse") {
    return {
      ...base,
      title: product.title || "",
      condition: "",
      price: Number(product.originalPrice || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
      text: joinSearchTerms([
        product.title,
        product.brand,
        product.type,
        product.connectivity,
        product.resolution,
      ]),
    };
  }

  if (type === "smartwatch") {
    return {
      ...base,
      title: product.title || "",
      condition: "",
      price: Number(product.originalPrice || 0),
      discount: Number(product.discount || 0),
      finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
      text: joinSearchTerms([
        product.title,
        product.brand,
        product.displaySize,
        product.displayType,
        product.batteryRuntime,
      ]),
    };
  }

  return {
    ...base,
    title: product.title || "",
    condition: "",
    price: Number(product.originalPrice || 0),
    discount: Number(product.discount || 0),
    finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
    text: joinSearchTerms([product.title, product.brand, product.type]),
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

export async function syncMongoProductsToSolr(options = {}) {
  const { force = false } = options;

  if (!force && !isSolrEnabled()) {
    return { synced: false, reason: "solr-disabled", count: 0 };
  }

  await ensureSolrSchema();
  const docs = await loadAllSearchableProducts();
  await axios.post(`${getSolrJsonDocsUpdateUrl()}?commit=true`, docs, {
    headers: { "Content-Type": "application/json" },
    timeout: Number(process.env.SOLR_TIMEOUT_MS || 8000),
  });

  return { synced: true, count: docs.length };
}

export async function getSearchHealth() {
  const enabled = isSolrEnabled();
  const configured = Boolean(process.env.SOLR_URL || process.env.SOLR_CORE);

  if (!configured) {
    return {
      engine: getSearchEngine(),
      solr: {
        configured: false,
        enabled,
        ready: false,
        core: getSolrCore(),
        baseUrl: getSolrBaseUrl(),
      },
    };
  }

  try {
    const response = await axios.get(getSolrHealthUrl(), {
      params: {
        action: "STATUS",
        core: getSolrCore(),
        wt: "json",
      },
      timeout: Number(process.env.SOLR_TIMEOUT_MS || 4000),
    });

    const coreStatus = response.data?.status?.[getSolrCore()];

    return {
      engine: getSearchEngine(),
      solr: {
        configured: true,
        enabled,
        ready: Boolean(coreStatus),
        core: getSolrCore(),
        baseUrl: getSolrBaseUrl(),
      },
    };
  } catch (error) {
    return {
      engine: getSearchEngine(),
      solr: {
        configured: true,
        enabled,
        ready: false,
        core: getSolrCore(),
        baseUrl: getSolrBaseUrl(),
        error: error.message,
      },
    };
  }
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
