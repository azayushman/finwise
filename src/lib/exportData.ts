/**
 * src/lib/exportData.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Client-side data export helpers for FinWise.
 *
 * All functions:
 *  • Are browser-only (guarded by typeof window check).
 *  • Wrap download logic in try/catch so they never propagate unhandled
 *    errors across mobile or desktop browsers.
 *  • Clean up object URLs after use to avoid memory leaks.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface BudgetExpenseExport {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: "fixed" | "variable";
}

export interface FinWiseBackup {
  exportedAt: string;       // ISO-8601 timestamp
  appVersion: string;
  currency: string;
  budget: {
    income: string;
    savingsRate: string;
    expenses: BudgetExpenseExport[];
  };
  savings: {
    goalName: string;
    targetAmount: string;
    currentSavings: string;
    monthlyContrib: string;
    targetDate: string;
    annualRate: string;
  } | null;
}

export interface CsvRow {
  Category: string;
  Amount: number;
  Type: string;   // "Need" | "Want" | "Savings" as mapped by caller
  Date: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD in the user's local timezone. */
export function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Escape a single CSV cell value.
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 */
function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ── JSON download ──────────────────────────────────────────────────────────

/**
 * Serialise `data` to a pretty-printed JSON blob and trigger a browser
 * download named `filename`.
 *
 * Safe to call in any browser / mobile WebView that supports Blob and
 * URL.createObjectURL. Falls back silently if those APIs are absent.
 */
export function downloadJSON(data: unknown, filename: string): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    triggerDownload(blob, filename);
  } catch (err) {
    console.error("[exportData] JSON export failed:", err);
  }
}

// ── CSV download ───────────────────────────────────────────────────────────

/**
 * Convert an array of `CsvRow` objects to a UTF-8 CSV string and trigger
 * a browser download named `filename`.
 *
 * Columns are always output in the fixed order: Category, Amount, Type, Date.
 */
export function downloadCSV(rows: CsvRow[], filename: string): void {
  if (typeof window === "undefined") return;
  try {
    const HEADERS: (keyof CsvRow)[] = ["Category", "Amount", "Type", "Date"];
    const headerLine = HEADERS.join(",");
    const dataLines = rows.map((row) =>
      HEADERS.map((h) => escapeCsvCell(row[h])).join(",")
    );
    // BOM makes Excel auto-detect UTF-8 correctly on Windows
    const csv = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
  } catch (err) {
    console.error("[exportData] CSV export failed:", err);
  }
}

// ── Shared download trigger ────────────────────────────────────────────────

/**
 * Creates a temporary <a> element, assigns an object URL, clicks it, then
 * revokes the URL. Works across Chrome, Firefox, Safari (desktop + mobile).
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    // Delay revoke slightly so the browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// ── Backup builder ─────────────────────────────────────────────────────────

/** Build the full FinWise JSON backup object. */
export function buildFinWiseBackup(params: {
  currency: string;
  income: string;
  savingsRate: string;
  expenses: BudgetExpenseExport[];
  savings?: {
    goalName: string;
    targetAmount: string;
    currentSavings: string;
    monthlyContrib: string;
    targetDate: string;
    annualRate: string;
  } | null;
}): FinWiseBackup {
  return {
    exportedAt: new Date().toISOString(),
    appVersion: "1.0.0",
    currency: params.currency,
    budget: {
      income: params.income,
      savingsRate: params.savingsRate,
      expenses: params.expenses,
    },
    savings: params.savings ?? null,
  };
}

// ── localStorage reset ─────────────────────────────────────────────────────

/** Clear all persisted FinWise localStorage keys. */
export function clearFinWiseStorage(): void {
  if (typeof window === "undefined") return;
  const KEYS = ["finwise_currency", "finwise_chat_messages"];
  for (const key of KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Private browsing / storage access denied — ignore
    }
  }
}
