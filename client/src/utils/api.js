import axios from "axios";

const LEGACY_API_ORIGIN_PATTERN = /^https?:\/\/(?:localhost|127\.0\.0\.1|api):3000(?=\/|$)/i;
const LEGACY_ASSET_PATH_PATTERN = /(?:^|\/)(?:client\/)?src\/assets\/images\/(.+)$/i;
const RELATIVE_API_PATH_PATTERN = /^\/?api(?=\/|$)/i;

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function resolveDefaultApiBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return "";
}

function getStoredAuthToken(targetUrl = "") {
  if (typeof window === "undefined") {
    return "";
  }

  const normalizedTarget = String(targetUrl || "");
  const isSellerRequest =
    normalizedTarget.includes("/api/seller/") ||
    normalizedTarget.endsWith("/api/seller");
  const isSupervisorRequest =
    normalizedTarget.includes("/api/supervisor/") ||
    normalizedTarget.includes("/api/supervisor-auth/");
  const isAdminRequest =
    normalizedTarget.includes("/api/admin/") ||
    normalizedTarget.includes("/api/admin-auth/");
  const isAuthRoute =
    normalizedTarget.includes("/api/auth/") ||
    normalizedTarget.includes("/api/supervisor-auth/") ||
    normalizedTarget.includes("/api/admin-auth/") ||
    normalizedTarget.includes("/api/seller/login") ||
    normalizedTarget.includes("/api/seller/signup");

  if (isAuthRoute) {
    return "";
  }

  if (isSellerRequest) {
    return window.localStorage.getItem("sellerToken") || "";
  }

  if (isSupervisorRequest) {
    return window.localStorage.getItem("supervisorToken") || "";
  }

  if (isAdminRequest) {
    return window.localStorage.getItem("adminToken") || "";
  }

  return window.localStorage.getItem("token") || "";
}

function withAuthorizationHeader(targetUrl, headers = new Headers()) {
  const nextHeaders = new Headers(headers);
  const token = getStoredAuthToken(targetUrl);

  if (token && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  return nextHeaders;
}

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    resolveDefaultApiBaseUrl()
);

export function normalizeApiUrl(url) {
  if (typeof url !== "string" || !url) {
    return url;
  }

  const normalizedUrl = url.replace(LEGACY_API_ORIGIN_PATTERN, API_BASE_URL);

  if (!API_BASE_URL) {
    return normalizedUrl;
  }

  if (RELATIVE_API_PATH_PATTERN.test(normalizedUrl)) {
    const apiPath = normalizedUrl.startsWith("/") ? normalizedUrl : `/${normalizedUrl}`;
    return `${API_BASE_URL}${apiPath}`;
  }

  return normalizedUrl;
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
  const normalizedPath = String(path || "").trim();

  if (!normalizedPath) {
    return normalizedPath;
  }

  const slashNormalizedPath = normalizedPath.replace(/\\/g, "/");

  if (slashNormalizedPath.startsWith("/images/")) {
    return slashNormalizedPath;
  }

  if (slashNormalizedPath.startsWith("images/")) {
    return `/${slashNormalizedPath}`;
  }

  const legacyAssetMatch = slashNormalizedPath.match(LEGACY_ASSET_PATH_PATTERN);
  if (legacyAssetMatch?.[1]) {
    return `/images/${legacyAssetMatch[1]}`.replace(/\/+/g, "/");
  }

  return buildApiUrl(normalizedPath);
}

function patchWindowFetch() {
  if (typeof window === "undefined" || window.__SMART_EXCHANGE_FETCH_PATCHED__) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === "string") {
      const normalizedUrl = normalizeApiUrl(input);
      return originalFetch(normalizedUrl, {
        ...init,
        headers: withAuthorizationHeader(normalizedUrl, init?.headers),
      });
    }

    if (input instanceof URL) {
      const normalizedUrl = normalizeApiUrl(input.toString());
      return originalFetch(new URL(normalizedUrl), {
        ...init,
        headers: withAuthorizationHeader(normalizedUrl, init?.headers),
      });
    }

    if (input instanceof Request) {
      const normalizedUrl = normalizeApiUrl(input.url);
      const request = new Request(normalizedUrl, {
        ...input,
        headers: withAuthorizationHeader(normalizedUrl, input.headers),
      });

      return originalFetch(request, {
        ...init,
        headers: withAuthorizationHeader(normalizedUrl, init?.headers || request.headers),
      });
    }

    return originalFetch(input, {
      ...init,
      headers: withAuthorizationHeader("", init?.headers),
    });
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

    const requestUrl = `${config.baseURL || ""}${config.url || ""}`;
    const token = getStoredAuthToken(requestUrl);
    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  });

  axios.__SMART_EXCHANGE_PATCHED__ = true;
}

patchWindowFetch();
patchAxios();
