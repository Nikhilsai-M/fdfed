import axios from "axios";

const LOCAL_API_ORIGIN_PATTERN = /^https?:\/\/(?:localhost|127\.0\.0\.1):3000(?=\/|$)/i;

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function resolveDefaultApiBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return "";
}

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_PROXY_TARGET ||
    resolveDefaultApiBaseUrl()
);

export function normalizeApiUrl(url) {
  if (typeof url !== "string" || !url) {
    return url;
  }

  return url.replace(LOCAL_API_ORIGIN_PATTERN, API_BASE_URL);
}

export function buildApiUrl(path = "") {
  const normalizedPath = String(path || "");

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizeApiUrl(normalizedPath);
  }

  if (!normalizedPath.startsWith("/")) {
    return API_BASE_URL ? `${API_BASE_URL}/${normalizedPath}` : `/${normalizedPath}`;
  }

  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

export function buildAssetUrl(path = "") {
  return buildApiUrl(path);
}

function patchWindowFetch() {
  if (typeof window === "undefined" || window.__SMART_EXCHANGE_FETCH_PATCHED__) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === "string") {
      return originalFetch(normalizeApiUrl(input), init);
    }

    if (input instanceof URL) {
      return originalFetch(new URL(normalizeApiUrl(input.toString())), init);
    }

    if (input instanceof Request) {
      return originalFetch(new Request(normalizeApiUrl(input.url), input), init);
    }

    return originalFetch(input, init);
  };

  window.__SMART_EXCHANGE_FETCH_PATCHED__ = true;
}

function patchAxios() {
  if (axios.__SMART_EXCHANGE_PATCHED__) {
    return;
  }

  axios.interceptors.request.use((config) => {
    if (config.baseURL) {
      config.baseURL = normalizeApiUrl(config.baseURL);
    }

    if (config.url) {
      config.url = normalizeApiUrl(config.url);
    }

    return config;
  });

  axios.__SMART_EXCHANGE_PATCHED__ = true;
}

patchWindowFetch();
patchAxios();

