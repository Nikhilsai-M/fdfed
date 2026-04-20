import { describe, expect, it } from "vitest";
import {
  buildTextQuery,
  buildTextSort,
  getSearchCacheKey,
  isCategoryQuery,
} from "../controllers/search.controller.js";

describe("search helpers", () => {
  // ─── getSearchCacheKey ────────────────────────────────────────────────────

  it("normalizes cache keys for repeated searches", () => {
    expect(getSearchCacheKey("  iPhone  ")).toBe("search:iphone");
  });

  // ─── isCategoryQuery ──────────────────────────────────────────────────────

  it("detects category searches", () => {
    expect(isCategoryQuery("phones", ["phone", "phones"])).toBe(true);
    expect(isCategoryQuery("iphone", ["phone", "phones"])).toBe(false);
  });

  // ─── buildTextQuery / buildTextSort ───────────────────────────────────────

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

  it("builds a text query for multi-word searches", () => {
    expect(buildTextQuery("apple iphone")).toEqual({
      $text: { $search: "apple iphone" },
    });
  });
});
