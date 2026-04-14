import { describe, expect, it } from "vitest";
import {
  buildTextQuery,
  buildTextSort,
  getSearchCacheKey,
  isCategoryQuery,
} from "../controllers/search.controller.js";

describe("search.controller helpers", () => {
  it("normalizes cache keys for repeated searches", () => {
    expect(getSearchCacheKey("  iPhone  ")).toBe("search:iphone");
  });

  it("detects category searches", () => {
    expect(isCategoryQuery("phones", ["phone", "phones"])).toBe(true);
    expect(isCategoryQuery("iphone", ["phone", "phones"])).toBe(false);
  });

  it("builds text search objects for indexed lookups", () => {
    expect(buildTextQuery("samsung")).toEqual({
      $text: { $search: "samsung" },
    });
    expect(buildTextSort()).toEqual({
      score: { $meta: "textScore" },
      created_at: -1,
      _id: -1,
    });
  });
});
