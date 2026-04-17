import { describe, expect, it } from "vitest";
import {
  buildSolrDocument,
  buildSolrQuery,
  buildTextQuery,
  buildTextSort,
  escapeSolrTerm,
  getSearchCacheKey,
  isCategoryQuery,
} from "../services/search.service.js";

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

  it("builds safe Solr queries", () => {
    expect(buildSolrQuery("phones")).toBe("type:phone");
    expect(escapeSolrTerm("iphone+case")).toBe("iphone\\+case");
    expect(buildSolrQuery("iphone+case")).toContain("iphone\\+case");
  });

  it("builds Solr documents for phones and accessories", () => {
    const phoneDoc = buildSolrDocument("phone", {
      id: 101,
      brand: "Apple",
      model: "iPhone 15",
      base_price: 50000,
      discount: 10,
      created_at: "2026-04-10T10:00:00.000Z",
    });

    const chargerDoc = buildSolrDocument("charger", {
      id: "c1",
      title: "GaN Charger",
      brand: "Anker",
      originalPrice: 2500,
      discount: 20,
      wattage: "65W",
      type: "USB-C",
      outputCurrent: "3A",
    });

    expect(phoneDoc.id).toBe("phone:101");
    expect(phoneDoc.finalPrice).toBe(45000);
    expect(chargerDoc.id).toBe("charger:c1");
    expect(chargerDoc.text).toContain("65W");
  });
});
