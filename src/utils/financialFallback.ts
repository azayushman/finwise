// Client-side fallback engine for static hosting (e.g., Netlify static deployments)
// Wall Street Heritage Strategist: Exclusively confined to personal finance, market economics, and capital allocation

const NON_FINANCIAL_PATTERNS = [
  "code", "python", "javascript", "html", "css", "react", "java", "c++", "sql", "programming", "debug",
  "recipe", "cook", "bake", "physics", "biology", "chemistry", "poem", "story",
  "essay", "lyrics", "movie", "cricket", "football", "weather", "translate", "joke", "dating", "game"
];

const GREETINGS = ["hi", "hello", "hey", "good morning", "good evening", "who are you", "what can you do", "help", "greetings"];

const FINANCIAL_KEYWORDS = [
  "finance", "budget", "save", "saving", "invest", "investing", "stock", "mutual fund", "sip",
  "fd", "ppf", "nps", "interest", "compound", "debt", "loan", "emi", "credit", "card", "cibil",
  "score", "tax", "emergency", "salary", "expense", "spend", "inflation", "wealth", "bank",
  "retirement", "etf", "index fund", "asset", "liability", "net worth", "gold", "insurance",
  "50/30/20", "rule of 72", "lumpsum", "broker", "afford", "wall street", "capital", "yield",
  "treasury", "bonds", "liquidity", "margin", "graham", "bogle", "diversification", "dollar"
];

export function getClientFinancialAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. Check for explicit non-financial queries
  if (NON_FINANCIAL_PATTERNS.some((term) => q.includes(term))) {
    return "As a Wall Street capital strategist and wealth preservation advisor, my advisory remit is strictly confined to personal finance, capital allocation, market economics, budgeting, and financial fundamentals. Let us direct our focus to your financial balance sheet, capital reserves, debt strategy, or long-term compounding plan.";
  }

  // 2. Check if greeting
  if (GREETINGS.some((g) => q === g || q.startsWith(g + " ") || q.endsWith(" " + g))) {
    return "Greetings. I am your **Wall Street Heritage Strategist**.\n\nMy advisory remit applies 230+ years of institutional market history and empirical capital allocation to your personal balance sheet:\n\n• **50/30/20 Capital Allocation Framework**\n• **Empirical Compound Growth & Systematic Investing (SIP)**\n• **Institutional Emergency Liquidity Reserves**\n• **High-Interest Debt Eradication (Avalanche & Snowball)**\n\nWhat dimension of your financial balance sheet shall we evaluate today?";
  }

  // 3. Strict Finance Gating
  const isFinance = FINANCIAL_KEYWORDS.some((kw) => q.includes(kw));
  if (!isFinance) {
    return "As a Wall Street capital strategist and wealth preservation advisor, my advisory remit is strictly confined to personal finance, capital allocation, market economics, budgeting, and financial fundamentals. Let us direct our focus to your financial balance sheet, capital reserves, debt strategy, or long-term compounding plan.";
  }

  // 4. Topic-specific Wall Street responses
  if (q.includes("50/30/20") || q.includes("budget") || q.includes("rule")) {
    return "The **50/30/20 Capital Allocation Framework** is the individual investor's operating balance sheet:\n\n• **50% Essential Liabilities (Needs)**: Fixed obligations like housing, food, and basic utilities. In Wall Street terms, these are non-discretionary operating expenses (OPEX).\n• **30% Discretionary Consumption (Wants)**: Lifestyle expenditure, dining, and recreation.\n• **20% Capital Accumulation & Reserve (Savings & Debt)**: Liquidity buffers, debt liquidation, and long-term equity accumulation (e.g. broad-market SIPs).\n\n*Historical Context*: Much like Benjamin Graham's emphasis on maintaining a margin of safety, adhering to this ratio ensures unexpected economic downturns never force liquidation of long-term assets.";
  }

  if (q.includes("compound") || q.includes("interest") || q.includes("growth")) {
    return "The **Mechanics of Compound Growth** represent the bedrock of generational wealth:\n\n• **Mathematical Formula**: A = P(1 + r/n)^(nt)\n• **The Wall Street Principle**: Capital compounding relies on duration rather than speculative market timing. In 200+ years of US market history, no rolling 20-year period in diversified equities has ever suffered a negative nominal return.\n• **The Practical Takeaway**: Starting with $100 or ₹2,500 monthly at age 20 compounds to multiples of what an investor starting at age 35 with quadruple the capital could accumulate.";
  }

  if (q.includes("sip") || q.includes("invest") || q.includes("stock") || q.includes("index")) {
    return "**Systematic Capital Allocation (SIP / Dollar-Cost Averaging)**:\n\n• **Empirical Advantage**: By committing fixed capital at regular monthly intervals, you systematically accumulate more asset units during market drawdowns and fewer at cyclical peaks.\n• **Historical Precedent**: From the 1792 Buttonwood Agreement under 68 Wall Street to modern automated index clearing houses, the single greatest determinant of investor wealth has not been timing tops or bottoms, but continuous liquidity deployment into low-cost, productive assets.\n• **Execution**: Automate your monthly allocation on the day your earnings arrive before discretionary expenses deplete your surplus.";
  }

  if (q.includes("emergency") || q.includes("fund") || q.includes("reserve") || q.includes("cushion")) {
    return "**Institutional Emergency Liquidity Reserves**:\n\n• **Target Horizon**: 3 to 6 months of mandatory baseline survival expenditures.\n• **Instrument**: High-yield risk-free savings or liquid treasury instruments — strictly segregated from volatile equities.\n• **Historical Precedent**: The Panic of 1907 taught Wall Street that solvency without immediate liquidity causes catastrophic liquidation. Your emergency reserve is your balance sheet's defensive covenant.";
  }

  if (q.includes("debt") || q.includes("credit card") || q.includes("loan") || q.includes("emi")) {
    return "**Debt Liquidation Strategy — Avalanche vs. Snowball**:\n\n• **Debt Avalanche (Mathematical Optimum)**: Direct all surplus cash flow toward the highest interest debt (e.g., 36-42% APR credit cards) while servicing minimums on remaining liabilities. Maximizes preserved capital.\n• **Debt Snowball (Behavioral Momentum)**: Liquidate smallest outstanding balances first to build psychological momentum.\n• **The Golden Rule**: No historical market investment reliably outpaces a 36% annualized credit card interest drag. Eradicate toxic debt before aggressive capital deployment.";
  }

  return "**Four Cardinal Rules of Wall Street Wealth Preservation**:\n\n1. **Maintain Positive Cash Flow**: Outflow must never exceed inflow.\n2. **Preserve Liquid Reserves**: Maintain 3-6 months of defensive reserves before undertaking equity risks.\n3. **Eliminate High-Interest Leverage**: Credit card liabilities compound exponentially against your net worth.\n4. **Automate Compounding**: Deploy surplus capital steadily into diversified broad-market indices.";
}
