import { describe, expect, it } from "vitest";
import {
  buildMeiliDocument,
  buildMeiliSearchParams,
  buildTextQuery,
  buildTextSort,
  getSearchCacheKey,
  isCategoryQuery,
} from "../services/search.service.js";
import { getMeiliHost } from "../config/meilisearch.js";

describe("search.service helpers", () => {
  it("normalizes cache keys for repeated searches", () => {
    expect(getSearchCacheKey("  iPhone  ")).toBe("search:iphone");
  });

  it("detects category searches", () => {
    expect(isCategoryQuery("phones", ["phone", "phones"])).toBe(true);
    expect(isCategoryQuery("iphone", ["phone", "phones"])).toBe(false);
  });

  it("builds text-search objects for indexed mongo lookups", () => {
    expect(buildTextQuery("samsung")).toEqual({ $text: { $search: "samsung" } });
    expect(buildTextSort()).toEqual({
      score: { $meta: "textScore" },
      created_at: -1,
      _id: -1,
    });
  });

  it("builds Meilisearch params for category and text searches", () => {
    expect(buildMeiliSearchParams("phones")).toEqual({
      query: "",
      options: {
        filter: ['type = "phone"'],
        sort: ["created_at:desc"],
        limit: 120,
      },
    });

    const params = buildMeiliSearchParams("iphone case");
    expect(params.query).toBe("iphone case");
    expect(params.options.sort).toEqual(["created_at:desc"]);
    expect(getMeiliHost()).toBe("http://127.0.0.1:7700");
  });

  it("builds Meilisearch documents for phones and accessories", () => {
    const phoneDoc = buildMeiliDocument("phone", {
      id: 101,
      brand: "Apple",
      model: "iPhone 15",
      base_price: 50000,
      discount: 10,
      created_at: "2026-04-10T10:00:00.000Z",
    });

    const chargerDoc = buildMeiliDocument("charger", {
      id: "c1",
      title: "GaN Charger",
      brand: "Anker",
      originalPrice: 2500,
      discount: 20,
      wattage: "65W",
      type: "USB-C",
      outputCurrent: "3A",
    });

    expect(phoneDoc.uid).toBe("phone:101");
    expect(phoneDoc.id).toBe("101");
    expect(phoneDoc.name).toBe("Apple iPhone 15");
    expect(phoneDoc.category).toBe("phone");
    expect(phoneDoc.finalPrice).toBe(45000);
    expect(chargerDoc.uid).toBe("charger:c1");
    expect(chargerDoc.name).toBe("GaN Charger");
    expect(chargerDoc.text).toContain("65W");
  });
});
