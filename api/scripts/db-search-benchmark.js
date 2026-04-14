import mongoose from "mongoose";
import dotenv from "dotenv";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

dotenv.config({ path: "../.env" });

const ITERATIONS = Math.max(3, Number.parseInt(process.env.DB_BENCHMARK_ITERATIONS || "5", 10));

const collections = [
  {
    label: "phones",
    name: Phone.collection.name,
    regexFields: ["brand", "model", "color", "processor", "os"],
  },
  {
    label: "laptops",
    name: Laptop.collection.name,
    regexFields: ["brand", "series", "processor_name", "os"],
  },
  {
    label: "chargers",
    name: Charger.collection.name,
    regexFields: ["title", "brand", "type", "wattage"],
  },
  {
    label: "earphones",
    name: Earphone.collection.name,
    regexFields: ["title", "brand", "design"],
  },
  {
    label: "mouses",
    name: Mouse.collection.name,
    regexFields: ["title", "brand", "type", "connectivity"],
  },
  {
    label: "smartwatches",
    name: Smartwatch.collection.name,
    regexFields: ["title", "brand", "displayType", "batteryRuntime"],
  },
];

function buildRegexQuery(fields) {
  return {
    $or: fields.map((field) => ({
      [field]: {
        $regex: "",
        $options: "i",
      },
    })),
  };
}

function extractSearchToken(document, fields) {
  for (const field of fields) {
    const value = String(document?.[field] || "").trim();
    if (!value) {
      continue;
    }

    const token = value
      .split(/\s+/)
      .map((part) => part.replace(/[^a-z0-9]/gi, ""))
      .find((part) => part.length >= 3);

    if (token) {
      return token.toLowerCase();
    }
  }

  return null;
}

async function measureMs(operation) {
  const startedAt = performance.now();
  await operation();
  return performance.now() - startedAt;
}

function average(values) {
  if (values.length === 0) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

async function benchmarkCollection(collectionConfig) {
  const collection = mongoose.connection.db.collection(collectionConfig.name);
  const sampleDocument = await collection.findOne({});
  const searchTerm =
    process.env.DB_BENCHMARK_QUERY ||
    extractSearchToken(sampleDocument, collectionConfig.regexFields) ||
    "sample";

  const regexQuery = buildRegexQuery(collectionConfig.regexFields);
  regexQuery.$or = regexQuery.$or.map((condition) => {
    const [field] = Object.keys(condition);
    return {
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    };
  });
  const regexSamples = [];
  const indexedSamples = [];

  for (let index = 0; index < ITERATIONS; index += 1) {
    regexSamples.push(
      await measureMs(() => collection.find(regexQuery).sort({ _id: -1 }).limit(10).toArray())
    );
    indexedSamples.push(
      await measureMs(() =>
        collection
          .find({ $text: { $search: searchTerm } })
          .project({ score: { $meta: "textScore" } })
          .sort({ score: { $meta: "textScore" }, _id: -1 })
          .limit(10)
          .toArray()
      )
    );
  }

  const regexExplain = await collection.find(regexQuery).limit(10).explain("executionStats");
  const indexedExplain = await collection
    .find({ $text: { $search: searchTerm } })
    .project({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .explain("executionStats");

  const beforeMs = average(regexSamples);
  const afterMs = average(indexedSamples);
  const improvementPercent =
    beforeMs > 0 && afterMs > 0
      ? Number((((beforeMs - afterMs) / beforeMs) * 100).toFixed(2))
      : 0;

  return {
    collection: collectionConfig.label,
    query: searchTerm,
    before: {
      strategy: "regex collection scan style search",
      averageMs: beforeMs,
      totalDocsExamined: regexExplain.executionStats?.totalDocsExamined || 0,
      totalKeysExamined: regexExplain.executionStats?.totalKeysExamined || 0,
      winningStage: regexExplain.queryPlanner?.winningPlan?.stage || "UNKNOWN",
    },
    after: {
      strategy: "indexed MongoDB text search",
      averageMs: afterMs,
      totalDocsExamined: indexedExplain.executionStats?.totalDocsExamined || 0,
      totalKeysExamined: indexedExplain.executionStats?.totalKeysExamined || 0,
      winningStage:
        indexedExplain.queryPlanner?.winningPlan?.inputStage?.inputStage?.stage ||
        indexedExplain.queryPlanner?.winningPlan?.inputStage?.stage ||
        indexedExplain.queryPlanner?.winningPlan?.stage ||
        "UNKNOWN",
    },
    improvementPercent,
  };
}

async function run() {
  await mongoose.connect(process.env.MONGO);

  const results = [];
  for (const collectionConfig of collections) {
    results.push(await benchmarkCollection(collectionConfig));
  }

  const overallBefore = average(results.map((result) => result.before.averageMs));
  const overallAfter = average(results.map((result) => result.after.averageMs));
  const overallImprovement =
    overallBefore > 0 && overallAfter > 0
      ? Number((((overallBefore - overallAfter) / overallBefore) * 100).toFixed(2))
      : 0;

  console.log(
    JSON.stringify(
      {
        searchTerm: process.env.DB_BENCHMARK_QUERY || "auto-per-collection",
        iterations: ITERATIONS,
        generatedAt: new Date().toISOString(),
        overall: {
          beforeAverageMs: overallBefore,
          afterAverageMs: overallAfter,
          improvementPercent: overallImprovement,
        },
        results,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("DB search benchmark failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
