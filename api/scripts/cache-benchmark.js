import { performance } from "node:perf_hooks";

const API_BASE_URL = process.env.BENCHMARK_API_BASE_URL || "https://fdfed-1-4u4f.onrender.com";
const SEARCH_TERM = process.env.BENCHMARK_QUERY || "iphone";
const ITERATIONS = Math.max(3, Number.parseInt(process.env.BENCHMARK_ITERATIONS || "10", 10));

function stats(values) {
  if (values.length === 0) return {};

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);

  const percentile = (p) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  };

  return {
    avg: Number((sum / values.length).toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
    median: Number(percentile(50).toFixed(2)),
    p95: Number(percentile(95).toFixed(2)),
    p99: Number(percentile(99).toFixed(2)),
  };
}

async function measureRequest(url) {
  const startedAt = performance.now();

  try {
    const response = await fetch(url);
    const duration = performance.now() - startedAt;
    const body = await response.json();

    return {
      duration,
      cacheHeader: response.headers.get("x-cache") || "NONE",
      ok: response.ok,
      status: response.status,
      resultCount: body.count || body.results?.length || 0,
    };
  } catch (error) {
    return {
      duration: performance.now() - startedAt,
      cacheHeader: "ERROR",
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

async function run() {
  const url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(SEARCH_TERM)}`;
  const samples = [];

  console.log(`🚀 Running benchmark for: ${url}`);
  console.log(`🔁 Iterations: ${ITERATIONS}\n`);

  for (let i = 0; i < ITERATIONS; i++) {
    const sample = await measureRequest(url);
    samples.push(sample);

    console.log(
      `#${i + 1} → ${sample.duration.toFixed(2)} ms | ${sample.cacheHeader} | status: ${sample.status}`
    );
  }

  const missSamples = samples.filter((s) => s.cacheHeader === "MISS");
  const hitSamples = samples.filter((s) => s.cacheHeader === "HIT");

  const coldStats = stats(missSamples.map((s) => s.duration));
  const warmStats = stats(hitSamples.map((s) => s.duration));

  const hitRatio = Number(((hitSamples.length / samples.length) * 100).toFixed(2));
  const successRate = Number(
    ((samples.filter((s) => s.ok).length / samples.length) * 100).toFixed(2)
  );

  const improvement =
    coldStats.avg && warmStats.avg
      ? Number((((coldStats.avg - warmStats.avg) / coldStats.avg) * 100).toFixed(2))
      : 0;

  console.log("\n📊 FINAL RESULTS\n");

  console.log(
    JSON.stringify(
      {
        endpoint: url,
        iterations: ITERATIONS,

        cold: coldStats,
        warm: warmStats,

        improvementPercent: improvement,
        hitRatioPercent: hitRatio,
        successRatePercent: successRate,

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
  console.error("❌ Cache benchmark failed:", error);
  process.exit(1);
});