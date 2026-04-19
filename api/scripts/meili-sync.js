import mongoose from "mongoose";
import dotenv from "dotenv";
import { getMeiliHost, getMeiliIndexName } from "../config/meilisearch.js";
import {
  syncMongoProductsToMeili,
} from "../services/search.service.js";

dotenv.config({ path: "../.env" });

async function main() {
  await mongoose.connect(process.env.MONGO);
  const result = await syncMongoProductsToMeili({ force: true });
  console.log(JSON.stringify(result, null, 2));
  await mongoose.disconnect();
}

function printFriendlyMeiliError(error) {
  const host = getMeiliHost();
  const index = getMeiliIndexName();

  if (error?.code === "ECONNREFUSED" || error?.cause?.code === "ECONNREFUSED") {
    console.error(`MEILI_SYNC_SCRIPT_ERROR Unable to reach Meilisearch at ${host}`);
    console.error("Meilisearch does not appear to be running on this machine.");
    console.error(`Expected index: ${index}`);
    console.error("Start Meilisearch first, then rerun the sync command.");
    console.error("If you are using Docker Compose, run: docker compose up -d meilisearch");
    return;
  }

  const meiliMessage = error?.message || error?.cause?.message;
  if (meiliMessage) {
    console.error(`MEILI_SYNC_SCRIPT_ERROR ${meiliMessage}`);
    return;
  }

  console.error("MEILI_SYNC_SCRIPT_ERROR", error);
}

main().catch(async (error) => {
  printFriendlyMeiliError(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
