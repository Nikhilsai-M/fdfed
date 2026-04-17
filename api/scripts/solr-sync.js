import mongoose from "mongoose";
import dotenv from "dotenv";
import { syncMongoProductsToSolr } from "../services/search.service.js";

dotenv.config({ path: "../.env" });

async function main() {
  await mongoose.connect(process.env.MONGO);
  const result = await syncMongoProductsToSolr();
  console.log(JSON.stringify(result, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("SOLR_SYNC_SCRIPT_ERROR", error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
