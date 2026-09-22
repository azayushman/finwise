/**
 * Safe currency formatting utility for FinWise.
 * Prevents double currency symbols (e.g. "$$2,990.00") and guarantees
 * clean numerical rendering across all international currencies.
 */
export function formatCurrency(
  amount: number | undefined | null,
  symbol = "$",
  includeDecimals = false
): string {
  if (amount === undefined || amount === null || isNaN(amount) || !isFinite(amount)) {
    return `${cleanSymbol(symbol)}0${includeDecimals ? ".00" : ""}`;
  }

  const cleanSym = cleanSymbol(symbol);
  const formattedNumber = amount.toLocaleString("en-US", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `${cleanSym}${formattedNumber}`;
}

/**
 * Strips any redundant extra symbols and ensures clean single currency prefix.
 */
function cleanSymbol(symbol: string): string {
  if (!symbol) return "$";
  const trimmed = symbol.trim();
  // If user profile stored "$$" or similar typo, sanitize to single character
  if (trimmed.startsWith("$$")) return "$";
  if (trimmed.startsWith("₹₹")) return "₹";
  if (trimmed.startsWith("€€")) return "€";
  if (trimmed.startsWith("££")) return "£";
  return trimmed;
}
