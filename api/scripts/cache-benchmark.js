import { performance } from "node:perf_hooks";

const API_BASE_URL = process.env.BENCHMARK_API_BASE_URL || "http://localhost:3000";
const SEARCH_TERM = process.env.BENCHMARK_QUERY || "iphone";
const ITERATIONS = Math.max(3, Number.parseInt(process.env.BENCHMARK_ITERATIONS || "10", 10));

async function measureRequest(url) {
  const startedAt = performance.now();
  const response = await fetch(url);
  const duration = performance.now() - startedAt;
  const body = await response.json();

  return {
    duration,
    cacheHeader: response.headers.get("x-cache") || "NONE",
    ok: response.ok,
    resultCount: body.count || body.results?.length || 0,
  };
}

async function run() {
  const url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(SEARCH_TERM)}`;
  const samples = [];

  for (let index = 0; index < ITERATIONS; index += 1) {
    samples.push(await measureRequest(url));
  }

  const missSamples = samples.filter((sample) => sample.cacheHeader === "MISS");
  const hitSamples = samples.filter((sample) => sample.cacheHeader === "HIT");
  const average = (items) =>
    items.length === 0
      ? 0
      : Number(
          (items.reduce((sum, item) => sum + item.duration, 0) / items.length).toFixed(2)
        );

  const coldAverage = average(missSamples);
  const warmAverage = average(hitSamples);
  const improvement =
    coldAverage > 0 && warmAverage > 0
      ? Number((((coldAverage - warmAverage) / coldAverage) * 100).toFixed(2))
      : 0;

  console.log(
    JSON.stringify(
      {
        endpoint: url,
        iterations: ITERATIONS,
        coldAverageMs: coldAverage,
        warmAverageMs: warmAverage,
        improvementPercent: improvement,
        misses: missSamples.length,
        hits: hitSamples.length,
        samples,
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error("Cache benchmark failed:", error);
  process.exit(1);
});
