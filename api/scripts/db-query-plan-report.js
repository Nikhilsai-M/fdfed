import mongoose from "mongoose";
import dotenv from "dotenv";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

dotenv.config({ path: "../.env" });

const SEARCH_TERM = process.env.DB_EXPLAIN_QUERY || "iphone";

const collections = [
  ["phones", Phone.collection.name],
  ["laptops", Laptop.collection.name],
  ["chargers", Charger.collection.name],
  ["earphones", Earphone.collection.name],
  ["mouses", Mouse.collection.name],
  ["smartwatches", Smartwatch.collection.name],
];

function extractStages(plan = {}) {
  const stages = [];

  function visit(node) {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.stage) {
      stages.push(node.stage);
    }

    Object.values(node).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach(visit);
      } else if (value && typeof value === "object") {
        visit(value);
      }
    });
  }

  visit(plan);
  return [...new Set(stages)];
}

async function buildReport() {
  await mongoose.connect(process.env.MONGO);

  const report = [];

  for (const [label, collectionName] of collections) {
    const collection = mongoose.connection.db.collection(collectionName);
    const explanation = await collection
      .find({ $text: { $search: SEARCH_TERM } })
      .project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .explain("executionStats");

    report.push({
      collection: label,
      collectionName,
      winningPlanStages: extractStages(explanation.queryPlanner?.winningPlan),
      totalKeysExamined: explanation.executionStats?.totalKeysExamined || 0,
      totalDocsExamined: explanation.executionStats?.totalDocsExamined || 0,
      executionTimeMillis: explanation.executionStats?.executionTimeMillis || 0,
    });
  }

  console.log(
    JSON.stringify(
      {
        searchTerm: SEARCH_TERM,
        generatedAt: new Date().toISOString(),
        report,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

buildReport().catch(async (error) => {
  console.error("DB query plan report failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
