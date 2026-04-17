import {
  buildTextProjection,
  buildTextQuery,
  buildTextSort,
  getSearchCacheKey,
  isCategoryQuery,
  normalizeSearchTerm,
  searchCatalog,
} from "../services/search.service.js";

export {
  buildTextProjection,
  buildTextQuery,
  buildTextSort,
  getSearchCacheKey,
  isCategoryQuery,
};

export const searchProducts = async (req, res) => {
  try {
    const searchTerm = normalizeSearchTerm(req.query.q);

    if (!searchTerm) {
      return res.json({ success: true, results: [], count: 0, query: "", engine: "none" });
    }

    const { results, engine } = await searchCatalog(searchTerm);

    return res.json({
      success: true,
      results,
      count: results.length,
      query: searchTerm,
      engine,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};
