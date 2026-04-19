import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Earphone from "../models/earphone.model.js";
import Charger from "../models/charger.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";
import {
  getMeiliClient,
  getMeiliHost,
  getMeiliIndexName,
  getProductsIndex,
} from "../config/meilisearch.js";

const COLLECTION_LIMIT = 20;

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
  return process.env.SEARCH_ENGINE === "mongo" ? "mongo" : "meilisearch";
}

export function isMeiliEnabled() {
  return getSearchEngine() === "meilisearch";
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

export function buildMeiliSearchParams(searchTerm) {
  const lowerTerm = searchTerm.toLowerCase();

  for (const productType of PRODUCT_COLLECTIONS) {
    if (isCategoryQuery(lowerTerm, CATEGORY_TERMS[productType])) {
      return {
        query: "",
        options: {
          filter: [`type = "${productType}"`],
          sort: ["created_at:desc"],
          limit: COLLECTION_LIMIT * PRODUCT_COLLECTIONS.length,
        },
      };
    }
  }

  return {
    query: searchTerm,
    options: {
      sort: ["created_at:desc"],
      showRankingScore: true,
      limit: COLLECTION_LIMIT * PRODUCT_COLLECTIONS.length,
    },
  };
}

export function buildMeiliDocument(type, product) {
  const base = {
    uid: `${type}:${product.id}`,
    productId: String(product.id),
    id: String(product.id),
    type,
    category: type,
    brand: product.brand || "",
    image: product.image || "",
    created_at: new Date(product.created_at || Date.now()).toISOString(),
  };

  if (type === "phone") {
    return {
      ...base,
      name: `${product.brand} ${product.model}`.trim(),
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
      name: `${product.brand} ${product.series}`.trim(),
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
    name: product.title || "",
    title: product.title || "",
    condition: "",
    price: Number(product.originalPrice || 0),
    discount: Number(product.discount || 0),
    finalPrice: computeDiscountedPrice(product.originalPrice, product.discount),
    text: [product.title, product.brand, product.type, product.design, product.wattage, product.displayType, product.connectivity, product.batteryLife, product.outputCurrent, product.resolution, product.batteryRuntime].filter(Boolean).join(" "),
  };
}

function mapMeiliHit(hit) {
  return {
    id: hit.productId || hit.id,
    type: hit.type || hit.category,
    title: hit.title || hit.name,
    brand: hit.brand,
    image: hit.image,
    price: Number(hit.price || 0),
    discount: Number(hit.discount || 0),
    condition: hit.condition || undefined,
    finalPrice: Number(hit.finalPrice || 0),
    score: Number(hit._rankingScore ?? hit._matchesPosition ?? 0),
  };
}

export async function searchProductsWithMeili(searchTerm) {
  const { query, options } = buildMeiliSearchParams(searchTerm);
  const result = await getProductsIndex().search(query, options);

  return {
    engine: "meilisearch",
    results: (result.hits || []).map(mapMeiliHit),
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
    ...phones.map((item) => buildMeiliDocument("phone", item)),
    ...laptops.map((item) => buildMeiliDocument("laptop", item)),
    ...earphones.map((item) => buildMeiliDocument("earphone", item)),
    ...chargers.map((item) => buildMeiliDocument("charger", item)),
    ...mouses.map((item) => buildMeiliDocument("mouse", item)),
    ...smartwatches.map((item) => buildMeiliDocument("smartwatch", item)),
  ];
}

async function waitForTask(task) {
  return getMeiliClient().tasks.waitForTask(task.taskUid ?? task.uid, {
    timeOutMs: Number(process.env.MEILI_TIMEOUT_MS || 10000),
    intervalMs: 200,
  });
}

function isMissingMeiliIndexError(error) {
  const code = error?.code || error?.errorCode || error?.cause?.code || error?.cause?.errorCode;
  const status = error?.status || error?.response?.status || error?.cause?.status || error?.cause?.response?.status;
  const message = String(error?.message || error?.cause?.message || "").toLowerCase();

  return (
    code === "index_not_found" ||
    status === 404 ||
    message.includes("index `products` not found") ||
    message.includes("index not found")
  );
}

export async function ensureMeiliIndex() {
  const client = getMeiliClient();

  try {
    await client.getIndex(getMeiliIndexName());
  } catch (error) {
    if (!isMissingMeiliIndexError(error)) {
      throw error;
    }

    const task = await client.createIndex(getMeiliIndexName(), { primaryKey: "uid" });
    await waitForTask(task);
  }

  const index = client.index(getMeiliIndexName());
  const settingsTask = await index.updateSettings({
    searchableAttributes: ["name", "title", "brand", "text", "type", "category"],
    filterableAttributes: ["type", "category"],
    sortableAttributes: ["created_at", "price", "finalPrice"],
    displayedAttributes: ["uid", "productId", "id", "type", "category", "name", "title", "brand", "image", "price", "discount", "finalPrice", "condition", "created_at"],
    rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
  });

  await waitForTask(settingsTask);
}

export async function syncMongoProductsToMeili(options = {}) {
  const { force = false } = options;

  if (!force && !isMeiliEnabled()) {
    return { synced: false, reason: "meilisearch-disabled", count: 0 };
  }

  await ensureMeiliIndex();
  const docs = await loadAllSearchableProducts();
  const task = await getProductsIndex().addDocuments(docs, { primaryKey: "uid" });
  await waitForTask(task);

  return { synced: true, count: docs.length, index: getMeiliIndexName() };
}

export async function getSearchHealth() {
  const enabled = isMeiliEnabled();
  const configured = Boolean(process.env.MEILI_HOST);

  if (!configured) {
    return {
      engine: getSearchEngine(),
      meilisearch: {
        configured: false,
        enabled,
        ready: false,
        host: getMeiliHost(),
        index: getMeiliIndexName(),
      },
    };
  }

  try {
    const client = getMeiliClient();
    await client.health();
    const stats = await client.index(getMeiliIndexName()).getStats().catch(() => null);

    return {
      engine: getSearchEngine(),
      meilisearch: {
        configured: true,
        enabled,
        ready: true,
        host: getMeiliHost(),
        index: getMeiliIndexName(),
        documents: stats?.numberOfDocuments,
      },
    };
  } catch (error) {
    return {
      engine: getSearchEngine(),
      meilisearch: {
        configured: true,
        enabled,
        ready: false,
        host: getMeiliHost(),
        index: getMeiliIndexName(),
        error: error.message,
      },
    };
  }
}

let queuedSync = null;
export function queueMeiliSync() {
  if (!isMeiliEnabled()) {
    return null;
  }

  if (queuedSync) {
    return queuedSync;
  }

  queuedSync = new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const result = await syncMongoProductsToMeili();
        resolve(result);
      } catch (error) {
        console.warn("MEILI_SYNC_ERROR", error.message);
        resolve({ synced: false, reason: error.message, count: 0 });
      } finally {
        queuedSync = null;
      }
    }, Number(process.env.MEILI_SYNC_DEBOUNCE_MS || 1500));
  });

  return queuedSync;
}

export async function searchCatalog(searchTerm) {
  if (!isMeiliEnabled()) {
    return searchProductsWithMongo(searchTerm);
  }

  try {
    return await searchProductsWithMeili(searchTerm);
  } catch (error) {
    console.warn("MEILI_SEARCH_FALLBACK", error.message);
    const fallback = await searchProductsWithMongo(searchTerm);
    return {
      ...fallback,
      engine: `${fallback.engine}:fallback`,
    };
  }
}
