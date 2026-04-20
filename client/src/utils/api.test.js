import {
  API_BASE_URL,
  buildApiUrl,
  buildAssetUrl,
  normalizeApiUrl,
} from "./api";

describe("api utils", () => {
  it("normalizes relative API paths against the frontend origin", () => {
    expect(normalizeApiUrl("/api/health")).toBe(`${API_BASE_URL}/api/health`);
  });

  it("rewrites legacy localhost API origins", () => {
    expect(normalizeApiUrl("http://localhost:3000/api/cart")).toBe(
      `${API_BASE_URL}/api/cart`
    );
  });

  it("builds API URLs for relative paths without a leading slash", () => {
    expect(buildApiUrl("api/orders")).toBe(`${API_BASE_URL}/api/orders`);
  });

  it("preserves image asset paths under /images", () => {
    expect(buildAssetUrl("images/icons/logo1.png")).toBe("/images/icons/logo1.png");
  });

  it("converts legacy asset file paths into /images URLs", () => {
    expect(buildAssetUrl("client/src/assets/images/icons/logo1.png")).toBe(
      "/images/icons/logo1.png"
    );
  });
});
