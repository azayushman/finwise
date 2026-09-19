#!/usr/bin/env node
/**
 * scripts/dry-run.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive local dry-run test suite for FinWise.
 *
 * Part 1 — HTTP endpoint tests against a running local dev server.
 * Part 2 — Pure-math edge-case tests for SIP, EMI, and budget functions.
 *
 * Usage:
 *   node scripts/dry-run.mjs               # test against http://localhost:3000
 *   npm run dry-run
 *
 * Exit code:
 *   0 — all tests passed
 *   1 — one or more tests failed
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE = "http://localhost:3000";

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

function pass(label, ms) {
  passed++;
  console.log(`  ${green("✅ PASS:")} ${bold(label)} ${dim(`${ms}ms`)}`);
}

function fail(label, reason) {
  failed++;
  console.log(`  ${red("❌ FAIL:")} ${bold(label)}`);
  console.log(`         ${red(`→ ${reason}`)}`);
}

// ── Fetch with timeout ────────────────────────────────────────────────────────
async function timedFetch(url, opts = {}, timeoutMs = 15_000) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), timeoutMs);
  const t0 = Date.now();
  try {
    const res  = await fetch(url, { ...opts, signal: ac.signal });
    const body = await res.text();
    return { res, body, ms: Date.now() - t0 };
  } finally {
    clearTimeout(id);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1 — HTTP Endpoint Tests
// ═══════════════════════════════════════════════════════════════════════════════

async function check1_homepage() {
  const label = "Check 1 · GET /";
  try {
    const { res, body, ms } = await timedFetch(`${BASE}/`);
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    if (!body.toLowerCase().includes("finwise") && !body.toLowerCase().includes("financial"))
      return fail(label, "Body missing FinWise content");
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check2_quiz() {
  const label = "Check 2 · GET /quiz";
  try {
    const { res, ms } = await timedFetch(`${BASE}/quiz`);
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check3_assistant_page() {
  const label = "Check 3 · GET /assistant";
  try {
    const { res, ms } = await timedFetch(`${BASE}/assistant`);
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check4_health() {
  const label = "Check 4 · GET /api/health";
  try {
    const { res, body, ms } = await timedFetch(`${BASE}/api/health`);
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    const json = JSON.parse(body);
    if (json.status !== "healthy") return fail(label, `status=${json.status}`);
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check5_normal_prompt() {
  const label = "Check 5 · POST /api/assistant (normal prompt)";
  try {
    const { res, body, ms } = await timedFetch(`${BASE}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What is compound interest?" }),
    });
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    const json = JSON.parse(body);
    const text = json.response ?? json.message ?? "";
    if (typeof text !== "string" || text.trim().length === 0)
      return fail(label, "Empty response");
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check6_oversized_payload() {
  const label = "Check 6 · POST /api/assistant (oversized payload)";
  try {
    // The route rejects messages > 2000 chars with HTTP 400.
    const longMessage = "A".repeat(3001);
    const { res, ms } = await timedFetch(`${BASE}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: longMessage }),
    });
    if (res.status !== 400) return fail(label, `Expected 400, got ${res.status}`);
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

async function check7_sensitive_query() {
  const label = "Check 7 · POST /api/assistant (sensitive query)";
  try {
    const { res, body, ms } = await timedFetch(`${BASE}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Here is my credit card number 4111 2222 3333 4444",
      }),
    });
    if (res.status !== 200) return fail(label, `HTTP ${res.status}`);
    const json = JSON.parse(body);
    const text = (json.response ?? "").toLowerCase();
    // The safety filter returns a disclaimer mentioning credentials / card numbers
    if (!text.includes("credential") && !text.includes("card") && !text.includes("sensitive"))
      return fail(label, `No safety disclaimer in: ${text.slice(0, 100)}`);
    pass(label, ms);
  } catch (e) { fail(label, e.name === "AbortError" ? "Timeout" : e.message); }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2 — Mathematical Edge-Case Tests (pure in-process, no server)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Re-implement the formulas inline to keep the script zero-dependency (no TS
 * import, no build step). These mirror src/lib/calculations.ts exactly.
 */

function clamp(v, min, max) {
  if (Number.isNaN(v)) return min;
  return Math.min(Math.max(v, min), max);
}

function sipCalc(monthly, annualRate, years) {
  const p = clamp(monthly, 0, 1e8);
  const rate = clamp(annualRate, 0, 100);
  const t = clamp(years, 0, 50);
  if (p === 0 || t === 0) return { futureValue: 0, totalInvested: 0, estimatedReturns: 0 };
  const totalInvested = p * t * 12;
  if (rate === 0) return { futureValue: totalInvested, totalInvested, estimatedReturns: 0 };
  const i = (rate / 100) / 12;
  const n = t * 12;
  let fv = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  if (!Number.isFinite(fv)) fv = totalInvested;
  return { futureValue: fv, totalInvested, estimatedReturns: Math.max(0, fv - totalInvested) };
}

function emiCalc(principal, annualRate, years) {
  const p = clamp(principal, 0, 1e8);
  const rate = clamp(annualRate, 0, 100);
  const t = clamp(years, 0, 50);
  if (p === 0 || t === 0) return 0;
  if (rate === 0) return p / (t * 12);
  const r = (rate / 100) / 12;
  const n = t * 12;
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Number.isFinite(emi) ? emi : 0;
}

function budgetCalc(income) {
  const inc = clamp(income, 0, 1e8);
  if (inc === 0) return { needs: 0, wants: 0, savings: 0 };
  return { needs: inc * 0.5, wants: inc * 0.3, savings: inc * 0.2 };
}

/** Assert that every value in an object is Number.isFinite and not NaN. */
function assertAllFinite(label, obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== "number" || !Number.isFinite(v) || Number.isNaN(v)) {
      fail(label, `${k}=${v} is not a finite number`);
      return false;
    }
  }
  return true;
}

function mathTest_SIP_0_percent() {
  const label = "Math · SIP with 0% interest";
  const r = sipCalc(5000, 0, 10);
  if (!assertAllFinite(label, r)) return;
  if (r.futureValue !== r.totalInvested) return fail(label, `FV ${r.futureValue} ≠ invested ${r.totalInvested}`);
  if (r.estimatedReturns !== 0) return fail(label, `Returns should be 0, got ${r.estimatedReturns}`);
  pass(label, 0);
}

function mathTest_SIP_100_percent() {
  const label = "Math · SIP with 100% interest";
  const r = sipCalc(1000, 100, 5);
  if (!assertAllFinite(label, r)) return;
  if (r.futureValue <= r.totalInvested) return fail(label, `FV ${r.futureValue} should exceed invested ${r.totalInvested}`);
  pass(label, 0);
}

function mathTest_EMI_0_principal() {
  const label = "Math · EMI with 0 principal";
  const emi = emiCalc(0, 10, 5);
  if (!Number.isFinite(emi) || Number.isNaN(emi)) return fail(label, `EMI ${emi} is not finite`);
  if (emi !== 0) return fail(label, `EMI should be 0, got ${emi}`);
  pass(label, 0);
}

function mathTest_budget_0_income() {
  const label = "Math · 50/30/20 budget with 0 income";
  const b = budgetCalc(0);
  if (!assertAllFinite(label, b)) return;
  if (b.needs !== 0 || b.wants !== 0 || b.savings !== 0)
    return fail(label, `Expected all zeros, got ${JSON.stringify(b)}`);
  pass(label, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Runner
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log();
  console.log(bold("  FinWise Dry-Run Test Suite"));
  console.log(dim(`  Target: ${BASE}`));
  console.log(dim(`  Node:   ${process.version}`));
  console.log();

  // ── Part 1: HTTP endpoint checks ────────────────────────────────────────────
  console.log(cyan(bold("  ┌─ Part 1: HTTP Endpoint Tests")));
  console.log(cyan(dim("  │")));

  await check1_homepage();
  await check2_quiz();
  await check3_assistant_page();
  await check4_health();
  await check5_normal_prompt();
  await check6_oversized_payload();
  await check7_sensitive_query();

  console.log(cyan(dim("  │")));

  // ── Part 2: Math edge-case checks ───────────────────────────────────────────
  console.log(cyan(bold("  ├─ Part 2: Mathematical Edge Cases")));
  console.log(cyan(dim("  │")));

  mathTest_SIP_0_percent();
  mathTest_SIP_100_percent();
  mathTest_EMI_0_principal();
  mathTest_budget_0_income();

  console.log(cyan(dim("  │")));
  console.log(cyan(bold("  └─ Done")));
  console.log();

  // ── Summary ─────────────────────────────────────────────────────────────────
  const total = passed + failed;
  if (failed === 0) {
    console.log(green(bold(`  ✅ All ${total} tests passed.`)));
  } else {
    console.log(red(bold(`  ❌ ${failed} of ${total} tests failed.`)));
  }
  console.log();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(red(`\n  Fatal error: ${err.message}\n`));
  process.exit(1);
});
