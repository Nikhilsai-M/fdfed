import Phone from '../models/phone.model.js';
import Laptop from '../models/laptop.model.js';
import Earphone from '../models/earphone.model.js';
import Charger from '../models/charger.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';
import { getCache, setCache, isRedisReady } from "../config/redis.js";

const COLLECTION_LIMIT = 20;

const CATEGORY_TERMS = {
  phone: ['phone', 'phones', 'mobile', 'mobiles'],
  laptop: ['laptop', 'laptops', 'notebook', 'notebooks'],
  earphone: ['earphone', 'earphones', 'earbud', 'earbuds', 'headphone', 'headphones'],
  charger: ['charger', 'chargers', 'adapter', 'adapters'],
  mouse: ['mouse', 'mouses', 'mice'],
  smartwatch: ['smartwatch', 'smartwatches', 'watch', 'watches']
};

export const buildTextQuery = (term) => ({ $text: { $search: term } });
export const buildTextProjection = () => ({ score: { $meta: 'textScore' } });
export const buildTextSort = () => ({ score: { $meta: 'textScore' }, created_at: -1, _id: -1 });

export const isCategoryQuery = (term, values) => values.includes(term.toLowerCase());

export const getSearchCacheKey = (term) =>
  `search:${String(term || "").trim().toLowerCase()}`;
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({ success: true, results: [] });
    }

    const searchTerm = q.trim();
    const cacheKey = getSearchCacheKey(searchTerm);

// Try Redis cache first
if (isRedisReady()) {
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      ...cached,
      engine: "cache",
    });
  }
}
    const lowerTerm = searchTerm.toLowerCase();

    const phoneFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.phone) ? {} : buildTextQuery(searchTerm);
    const laptopFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.laptop) ? {} : buildTextQuery(searchTerm);
    const earphoneFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.earphone)
      ? { isActive: true }
      : { isActive: true, ...buildTextQuery(searchTerm) };
    const chargerFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.charger)
      ? { isActive: true }
      : { isActive: true, ...buildTextQuery(searchTerm) };
    const mouseFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.mouse)
      ? { isActive: true }
      : { isActive: true, ...buildTextQuery(searchTerm) };
    const smartwatchFilter = isCategoryQuery(lowerTerm, CATEGORY_TERMS.smartwatch)
      ? { isActive: true }
      : { isActive: true, ...buildTextQuery(searchTerm) };

    const genericProjection = {};
    const genericSort = { created_at: -1, _id: -1 };

    const [phones, laptops, earphones, chargers, mouses, smartwatches] = await Promise.all([
      Phone.find(phoneFilter, phoneFilter.$text ? buildTextProjection() : genericProjection)
        .sort(phoneFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
      Laptop.find(laptopFilter, laptopFilter.$text ? buildTextProjection() : genericProjection)
        .sort(laptopFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
      Earphone.find(earphoneFilter, earphoneFilter.$text ? buildTextProjection() : genericProjection)
        .sort(earphoneFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
      Charger.find(chargerFilter, chargerFilter.$text ? buildTextProjection() : genericProjection)
        .sort(chargerFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
      Mouse.find(mouseFilter, mouseFilter.$text ? buildTextProjection() : genericProjection)
        .sort(mouseFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
      Smartwatch.find(smartwatchFilter, smartwatchFilter.$text ? buildTextProjection() : genericProjection)
        .sort(smartwatchFilter.$text ? buildTextSort() : genericSort)
        .limit(COLLECTION_LIMIT)
        .lean(),
    ]);

    const results = [
      ...phones.map((phone) => ({
        id: phone.id,
        type: 'phone',
        title: phone.brand + " " + phone.model,
        brand: phone.brand,
        model: phone.model,
        image: phone.image,
        price: phone.base_price,
        discount: phone.discount || 0,
        condition: phone.condition,
        finalPrice: phone.base_price * (1 - (phone.discount || 0) / 100),
        score: phone.score || 0,
      })),
      ...laptops.map((laptop) => ({
        id: laptop.id,
        type: 'laptop',
        title: laptop.brand + " " + laptop.series,
        brand: laptop.brand,
        series: laptop.series,
        image: laptop.image,
        price: laptop.base_price,
        discount: laptop.discount || 0,
        condition: laptop.condition,
        finalPrice: laptop.base_price * (1 - (laptop.discount || 0) / 100),
        score: laptop.score || 0,
      })),
      ...earphones.map((earphone) => ({
        id: earphone.id,
        type: 'earphone',
        title: earphone.title,
        brand: earphone.brand,
        image: earphone.image,
        price: earphone.originalPrice,
        discount: earphone.discount || 0,
        finalPrice: earphone.originalPrice * (1 - (earphone.discount || 0) / 100),
        score: earphone.score || 0,
      })),
      ...chargers.map((charger) => ({
        id: charger.id,
        type: 'charger',
        title: charger.title,
        brand: charger.brand,
        image: charger.image,
        price: charger.originalPrice,
        discount: charger.discount || 0,
        finalPrice: charger.originalPrice * (1 - (charger.discount || 0) / 100),
        score: charger.score || 0,
      })),
      ...mouses.map((mouse) => ({
        id: mouse.id,
        type: 'mouse',
        title: mouse.title,
        brand: mouse.brand,
        image: mouse.image,
        price: mouse.originalPrice,
        discount: mouse.discount || 0,
        finalPrice: mouse.originalPrice * (1 - (mouse.discount || 0) / 100),
        score: mouse.score || 0,
      })),
      ...smartwatches.map((smartwatch) => ({
        id: smartwatch.id,
        type: 'smartwatch',
        title: smartwatch.title,
        brand: smartwatch.brand,
        image: smartwatch.image,
        price: smartwatch.originalPrice,
        discount: smartwatch.discount || 0,
        finalPrice: smartwatch.originalPrice * (1 - (smartwatch.discount || 0) / 100),
        score: smartwatch.score || 0,
      }))
    ].sort((a, b) => (b.score || 0) - (a.score || 0));

    const responseData = {
  success: true,
  results,
  count: results.length,
  query: searchTerm
};

// Store in Redis (TTL = 60 sec)
if (isRedisReady()) {
  await setCache(cacheKey, responseData, 60);
}

res.json(responseData);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};