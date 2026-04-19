import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  getSolrBaseUrl,
  getSolrCore,
  syncMongoProductsToSolr,
} from "../services/search.service.js";

dotenv.config({ path: "../.env" });

async function main() {
  await mongoose.connect(process.env.MONGO);
  const result = await syncMongoProductsToSolr({ force: true });
  console.log(JSON.stringify(result, null, 2));
  await mongoose.disconnect();
}

function printFriendlySolrError(error) {
  const solrBaseUrl = getSolrBaseUrl();
  const solrCore = getSolrCore();

  if (error?.code === "ECONNREFUSED") {
    console.error(`SOLR_SYNC_SCRIPT_ERROR Unable to reach Solr at ${solrBaseUrl}`);
    console.error("Solr does not appear to be running on this machine.");
    console.error(`Expected core: ${solrCore}`);
    console.error("Start Solr first, then rerun the sync command.");
    console.error("If you are using Docker Compose, run: docker compose up -d solr");
    return;
  }

  const solrMessage = error?.response?.data?.error?.msg;
  if (solrMessage) {
    console.error(`SOLR_SYNC_SCRIPT_ERROR ${solrMessage}`);
    if (solrMessage.includes('cannot change field')) {
      console.error("Your Solr core still has stale field metadata from an older schema.");
      console.error("Reset the Solr index/core once, then rerun the sync.");
      console.error("If you are using Docker Compose, run:");
      console.error("  docker compose down");
      console.error("  docker volume rm fdfed_solr_data");
      console.error("  docker compose up -d solr");
      console.error("  cd api && npm run search:solr:sync");
    }
    return;
  }

  console.error("SOLR_SYNC_SCRIPT_ERROR", error);
}

main().catch(async (error) => {
  printFriendlySolrError(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
