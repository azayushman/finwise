/**
 * src/lib/storage.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Safe localStorage helpers used across FinWise client components.
 *
 * All reads are wrapped in try/catch so that:
 *  • Malformed / tampered JSON never crashes a page.
 *  • Corrupted keys are automatically removed from storage so the next load
 *    starts fresh with the caller-supplied default value.
 *  • SSR environments (where `localStorage` is undefined) are handled by
 *    returning the default value silently.
 */

// ── Generic read helper ────────────────────────────────────────────────────

/**
 * Read and parse a JSON value from localStorage.
 *
 * @param key          - The localStorage key to read.
 * @param validate     - Optional validator that receives the parsed value and
 *                       returns `true` when the shape is acceptable.
 *                       If omitted, any successfully-parsed value is accepted.
 * @param defaultValue - Value returned when the key is absent, the JSON is
 *                       malformed, or validation fails.
 *
 * When validation fails or JSON.parse throws, the corrupted key is
 * automatically removed so the next call starts clean.
 */
export function safeGetJson<T>(
  key: string,
  validate: (parsed: unknown) => parsed is T,
  defaultValue: T,
): T {
  if (typeof window === "undefined") return defaultValue; // SSR guard

  const raw = localStorage.getItem(key);
  if (raw === null) return defaultValue;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (validate(parsed)) return parsed;

    // Parsed successfully but failed shape validation — treat as corrupt.
    console.warn(`[storage] "${key}" failed validation — clearing.`);
    localStorage.removeItem(key);
    return defaultValue;
  } catch {
    // JSON.parse threw — the stored string is malformed / tampered.
    console.warn(`[storage] "${key}" contains malformed JSON — clearing.`);
    localStorage.removeItem(key);
    return defaultValue;
  }
}

// ── Generic write helper ───────────────────────────────────────────────────

/**
 * Serialise a value to JSON and store it in localStorage.
 * Silently no-ops in SSR environments.
 */
export function safeSetJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota exceeded or private-browsing restriction — ignore gracefully.
    console.warn(`[storage] Could not write "${key}":`, err);
  }
}

/**
 * Remove a key from localStorage.
 * Silently no-ops in SSR environments.
 */
export function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// ── App-specific validators ────────────────────────────────────────────────

/** Shape expected for each chat message persisted by AssistantClient. */
export interface PersistedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Validate an individual message object.
 * Rejects items that are missing required fields, have wrong types, or
 * contain an unrecognised role value (which would break the chat renderer).
 */
export function isValidMessage(item: unknown): item is PersistedMessage {
  if (typeof item !== "object" || item === null) return false;
  const m = item as Record<string, unknown>;
  return (
    typeof m.id === "string" && m.id.trim() !== "" &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string"
  );
}

/**
 * Validate a full array of chat messages.
 * Rejects the whole array if it is not an array, is empty, or any single
 * element fails the per-item check.
 */
export function isValidMessageArray(parsed: unknown): parsed is PersistedMessage[] {
  return (
    Array.isArray(parsed) &&
    parsed.length > 0 &&
    parsed.every(isValidMessage)
  );
}
