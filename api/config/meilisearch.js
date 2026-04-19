import { MeiliSearch } from "meilisearch";

const DEFAULT_MEILI_HOST = "http://127.0.0.1:7700";
const DEFAULT_MEILI_INDEX = "products";

export function getMeiliHost() {
  return (process.env.MEILI_HOST || DEFAULT_MEILI_HOST).replace(/\/$/, "");
}

export function getMeiliAdminKey() {
  return process.env.MEILI_ADMIN_KEY || undefined;
}

export function getMeiliSearchKey() {
  return process.env.MEILI_SEARCH_KEY || undefined;
}

export function getMeiliIndexName() {
  return process.env.MEILI_INDEX || DEFAULT_MEILI_INDEX;
}

export function getMeiliClient() {
  return new MeiliSearch({
    host: getMeiliHost(),
    apiKey: getMeiliAdminKey(),
  });
}

export function getProductsIndex() {
  return getMeiliClient().index(getMeiliIndexName());
}
