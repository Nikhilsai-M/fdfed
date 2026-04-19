import Counter from "../models/counter.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

const CATEGORY_ID_CONFIG = {
  charger: { prefix: "ch", Model: Charger },
  earphone: { prefix: "ea", Model: Earphone },
  mouse: { prefix: "mo", Model: Mouse },
  smartwatch: { prefix: "sm", Model: Smartwatch },
};

function formatProductId(prefix, seq) {
  return `${prefix}_${String(seq).padStart(3, "0")}`;
}

async function getMaxExistingSequence(Model, prefix) {
  const regex = new RegExp(`^${prefix}_(\\d+)$`);
  const docs = await Model.find(
    { id: { $regex: `^${prefix}_\\d+$` } },
    { id: 1 }
  ).lean();

  return docs.reduce((max, doc) => {
    const match = String(doc.id || "").match(regex);
    if (!match) {
      return max;
    }

    const seq = Number(match[1]);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
}

export async function generateAccessoryProductId(category) {
  const config = CATEGORY_ID_CONFIG[category];

  if (!config) {
    throw new Error("Unsupported product category");
  }

  const counterKey = `seller_product:${category}`;
  const maxExistingSequence = await getMaxExistingSequence(
    config.Model,
    config.prefix
  );

  await Counter.updateOne(
    { _id: counterKey, seq: { $lt: maxExistingSequence } },
    { $set: { seq: maxExistingSequence } },
    { upsert: true }
  );

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const counter = await Counter.findOneAndUpdate(
      { _id: counterKey },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const productId = formatProductId(config.prefix, counter.seq);
    const existingProduct = await config.Model.exists({ id: productId });

    if (!existingProduct) {
      return productId;
    }
  }

  throw new Error(`Unable to generate a unique product ID for ${category}`);
}
