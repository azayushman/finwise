#!/usr/bin/env node
/**
 * scripts/smoke-test.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight post-deployment smoke test using native Node.js fetch (Node 18+).
 *
 * Usage:
 *   node scripts/smoke-test.mjs                            # defaults to http://localhost:3000
 *   node scripts/smoke-test.mjs https://finwise.vercel.app
 *   npm run smoke-test -- https://finwise.vercel.app
 *
 * Exit code:
 *   0 — all tests passed
 *   1 — one or more tests failed
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

// ── ANSI colour helpers ───────────────────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;

// ── Result tracking ───────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function pass(label, ms) {
  passed++;
  console.log(`  ${green("✅ PASS:")} ${bold(label)} ${dim(`in ${ms}ms`)}`);
}

function fail(label, reason) {
  failed++;
  console.log(`  ${red("❌ FAIL:")} ${bold(label)}`);
  console.log(`         ${red(`→ ${reason}`)}`);
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

/**
 * Fetch with a timeout and measure elapsed time.
 * @param {string}  url
 * @param {object}  [options]       fetch options
 * @param {number}  [timeoutMs=10000]
 * @returns {{ res: Response, body: string, ms: number }}
 */
async function timedFetch(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const t0 = Date.now();
  try {
    const res  = await fetch(url, { ...options, signal: controller.signal });
    const body = await res.text();
    return { res, body, ms: Date.now() - t0 };
  } finally {
    clearTimeout(id);
  }
}

// ── Individual test runners ───────────────────────────────────────────────────

async function testHomepage() {
  const label = "GET /";
  try {
    const { res, body, ms } = await timedFetch(`${BASE_URL}/`);
    if (res.status !== 200) {
      fail(label, `Expected HTTP 200, got ${res.status}`);
      return;
    }
    const titlePresent =
      body.includes("FinWise") ||
      body.includes("finwise") ||
      body.includes("Fin<") ||         // rendered HTML fragment
      body.toLowerCase().includes("financial");
    if (!titlePresent) {
      fail(label, `HTTP 200 but response body does not contain expected FinWise content`);
      return;
    }
    pass(label, ms);
  } catch (err) {
    fail(label, err.name === "AbortError" ? "Request timed out after 10s" : err.message);
  }
}

async function testQuizPage() {
  const label = "GET /quiz";
  try {
    const { res, ms } = await timedFetch(`${BASE_URL}/quiz`);
    if (res.status !== 200) {
      fail(label, `Expected HTTP 200, got ${res.status}`);
      return;
    }
    pass(label, ms);
  } catch (err) {
    fail(label, err.name === "AbortError" ? "Request timed out after 10s" : err.message);
  }
}

async function testHealthEndpoint() {
  const label = "GET /api/health";
  try {
    const { res, body, ms } = await timedFetch(`${BASE_URL}/api/health`);
    if (res.status !== 200) {
      fail(label, `Expected HTTP 200, got ${res.status}`);
      return;
    }
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      fail(label, `Response is not valid JSON: ${body.slice(0, 80)}`);
      return;
    }
    if (json.status !== "healthy") {
      fail(label, `Expected status "healthy", got "${json.status}"`);
      return;
    }
    pass(label, ms);
  } catch (err) {
    fail(label, err.name === "AbortError" ? "Request timed out after 10s" : err.message);
  }
}

async function testAssistantEndpoint() {
  const label = "POST /api/assistant";
  try {
    const { res, body, ms } = await timedFetch(
      `${BASE_URL}/api/assistant`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello" }),
      }
    );
    if (res.status !== 200) {
      fail(label, `Expected HTTP 200, got ${res.status}`);
      return;
    }
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      fail(label, `Response is not valid JSON: ${body.slice(0, 80)}`);
      return;
    }
    // The route returns { response: "..." } — accept any non-empty string
    const text = json.response ?? json.message ?? "";
    if (typeof text !== "string" || text.trim().length === 0) {
      fail(label, `Expected a non-empty response string, got: ${JSON.stringify(json).slice(0, 80)}`);
      return;
    }
    pass(label, ms);
  } catch (err) {
    fail(label, err.name === "AbortError" ? "Request timed out after 10s" : err.message);
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function main() {
  console.log();
  console.log(bold("  FinWise Smoke Tests"));
  console.log(dim(`  Target: ${BASE_URL}`));
  console.log(dim(`  Node:   ${process.version}`));
  console.log();

  await testHomepage();
  await testQuizPage();
  await testHealthEndpoint();
  await testAssistantEndpoint();

  console.log();

  const total = passed + failed;
  if (failed === 0) {
    console.log(green(bold(`  ✅ All ${total} tests passed.`)));
    console.log();
    process.exit(0);
  } else {
    console.log(red(bold(`  ❌ ${failed} of ${total} tests failed.`)));
    console.log();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(red(`\n  Fatal error: ${err.message}\n`));
  process.exit(1);
});
