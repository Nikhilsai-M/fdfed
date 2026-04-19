const DAY_MS = 24 * 60 * 60 * 1000;

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

export function getCookieSameSite() {
  return isProductionEnvironment() ? "none" : "lax";
}

export function getCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: isProductionEnvironment(),
    sameSite: getCookieSameSite(),
  };
}

export function getAuthCookieOptions(ttlMs = 7 * DAY_MS) {
  return {
    ...getCookieBaseOptions(),
    expires: new Date(Date.now() + ttlMs),
  };
}

export function getClearCookieOptions() {
  return getCookieBaseOptions();
}

export function getSessionCookieOptions() {
  return {
    secure: isProductionEnvironment(),
    httpOnly: true,
    sameSite: getCookieSameSite(),
    maxAge: DAY_MS,
  };
}

export function getAllowedOrigins() {
  const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function matchesOriginPattern(origin, pattern) {
  if (!pattern.includes("*")) {
    return origin === pattern;
  }

  const regex = new RegExp(`^${pattern.split("*").map(escapeRegex).join(".*")}$`);
  return regex.test(origin);
}

export function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.replace(/\/$/, "");
  return getAllowedOrigins().some((allowedOrigin) =>
    matchesOriginPattern(normalizedOrigin, allowedOrigin)
  );
}
