import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  PieChart,
  Shield,
  CreditCard,
  ArrowRight,
  Info,
  CheckCircle2,
  Landmark,
  Scale,
} from "lucide-react";
import { UserProfile } from "../types";
import { formatCurrency } from "../utils/currency";

interface ToolsViewProps {
  user: UserProfile;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ user }) => {
  const [activeTool, setActiveTool] = useState<"compound" | "budget503020" | "emergency" | "emi">("compound");

  // Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState(5000);
  const [ciMonthlySip, setCiMonthlySip] = useState(2500);
  const [ciRate, setCiRate] = useState(12);
  const [ciYears, setCiYears] = useState(10);

  // 50/30/20 State
  const [bIncome, setBIncome] = useState(45000);

  // Emergency Fund State
  const [efMonthlyExpense, setEfMonthlyExpense] = useState(25000);
  const [efMonths, setEfMonths] = useState(6);
  const [efCurrentSavings, setEfCurrentSavings] = useState(50000);

  // Loan EMI State
  const [emiPrincipal, setEmiPrincipal] = useState(300000);
  const [emiRate, setEmiRate] = useState(10.5);
  const [emiTenureMonths, setEmiTenureMonths] = useState(36);

  const sym = user.currencySymbol || "$";

  // Calculate Compound Interest / SIP
  const calculateCompoundInterest = () => {
    const r = ciRate / 100 / 12;
    const n = ciYears * 12;
    // FV of principal
    const fvPrincipal = ciPrincipal * Math.pow(1 + r, n);
    // FV of monthly SIP
    const fvSip = r > 0 ? ciMonthlySip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : ciMonthlySip * n;
    const totalMaturity = Math.round(fvPrincipal + fvSip);
    const totalInvested = ciPrincipal + ciMonthlySip * n;
    const totalWealthGained = Math.max(0, totalMaturity - totalInvested);

    return { totalMaturity, totalInvested, totalWealthGained };
  };

  // Calculate EMI
  const calculateEmi = () => {
    const monthlyRate = emiRate / 12 / 100;
    const n = emiTenureMonths;
    if (monthlyRate === 0) {
      const emi = Math.round(emiPrincipal / n);
      return { emi, totalPayment: emiPrincipal, totalInterest: 0 };
    }
    const emi = Math.round(
      (emiPrincipal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1)
    );
    const totalPayment = emi * n;
    const totalInterest = Math.max(0, totalPayment - emiPrincipal);
    return { emi, totalPayment, totalInterest };
  };

  const ciResult = calculateCompoundInterest();
  const emiResult = calculateEmi();
  const efTarget = efMonthlyExpense * efMonths;
  const efGap = Math.max(0, efTarget - efCurrentSavings);
  const efProgressPct = Math.min(100, Math.round((efCurrentSavings / (efTarget || 1)) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-amber-500/15">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Quantitative Finance Calculators</span>
        </div>
        <h1 className="text-3xl font-black text-white font-wallstreet tracking-tight">
          Financial Engineering <span className="gold-gradient-text">Models</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate compounding duration, 50/30/20 balance sheet distribution, defensive reserves, and debt amortization.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-[#0E121B] p-1.5 rounded-2xl border border-amber-500/20">
        {[
          { id: "compound", label: "Compound Growth & SIP", icon: TrendingUp },
          { id: "budget503020", label: "50/30/20 Balance Sheet", icon: PieChart },
          { id: "emergency", label: "Defensive Reserve", icon: Shield },
          { id: "emi", label: "Debt & EMI Amortizer", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id as any)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
              id={`tool-tab-${tab.id}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: COMPOUND INTEREST */}
      {activeTool === "compound" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Capital Parameters
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-400">Monthly SIP Allocation</span>
                <span className="text-white font-data text-sm">{formatCurrency(ciMonthlySip, sym, true)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={ciMonthlySip}
                onChange={(e) => setCiMonthlySip(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-data mt-1">
                <span>{formatCurrency(500, sym)}</span>
                <span>{formatCurrency(25000, sym)}</span>
                <span>{formatCurrency(50000, sym)}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-400">Initial Seed Capital (Lump Sum)</span>
                <span className="text-white font-data text-sm">{formatCurrency(ciPrincipal, sym, true)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={ciPrincipal}
                onChange={(e) => setCiPrincipal(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-data mt-1">
                <span>{formatCurrency(0, sym)}</span>
                <span>{formatCurrency(100000, sym)}</span>
                <span>{formatCurrency(200000, sym)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Expected Return (% p.a.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.5"
                    value={ciRate}
                    onChange={(e) => setCiRate(Math.max(1, Math.min(30, Number(e.target.value))))}
                    className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white font-data focus:border-amber-400 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Compounding Horizon (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={ciYears}
                  onChange={(e) => setCiYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white font-data focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E121B] border border-amber-500/15 text-xs text-slate-400 space-y-1.5">
              <span className="block text-white font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Benchmark Reference Rates
              </span>
              <p className="text-[11px] leading-relaxed">
                Historically, broad-market equity indices (e.g. S&P 500 or Nifty 50) have generated ~11-13% nominal annualized returns over 15+ year cycles. Bank deposits typically yield ~6-7%.
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/25 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-wallstreet">Maturity Projection</h3>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#0E121B] to-slate-900 border border-amber-500/30 text-center">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold font-wallstreet">
                Total Portfolio Valuation After {ciYears} Years
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-data mt-1 mb-2">
                {formatCurrency(ciResult.totalMaturity, sym, true)}
              </div>
              <span className="text-xs text-amber-300 font-semibold font-data">
                Compounded Gain: +{formatCurrency(ciResult.totalWealthGained, sym, true)} ({Math.round((ciResult.totalWealthGained / (ciResult.totalInvested || 1)) * 100)}%)
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Total Out-of-Pocket Contribution</span>
                <span className="text-white font-data">{formatCurrency(ciResult.totalInvested, sym, true)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-300">Compounded Growth Returns</span>
                <span className="text-amber-300 font-data font-bold">+{formatCurrency(ciResult.totalWealthGained, sym, true)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#080B10] overflow-hidden flex border border-slate-800">
                <div
                  style={{
                    width: `${Math.round((ciResult.totalInvested / (ciResult.totalMaturity || 1)) * 100)}%`,
                  }}
                  className="h-full bg-slate-600"
                />
                <div
                  style={{
                    width: `${Math.round((ciResult.totalWealthGained / (ciResult.totalMaturity || 1)) * 100)}%`,
                  }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-white block font-wallstreet">The Wall Street Arithmetic</span>
              <p className="text-[11px] leading-relaxed">
                By maintaining monthly discipline, {Math.round((ciResult.totalWealthGained / (ciResult.totalMaturity || 1)) * 100)}% of your final portfolio value is pure compounded capital. Time in the market is your greatest leverage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: 50/30/20 BUDGET */}
      {activeTool === "budget503020" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              Net Operating Inflow
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Enter your net monthly income (after deductions)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-amber-300 font-data">{sym}</span>
                <input
                  type="number"
                  min="5000"
                  max="1000000"
                  step="1000"
                  value={bIncome}
                  onChange={(e) => setBIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl pl-8 pr-4 py-3 text-base text-white font-data focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-white font-wallstreet">Institutional Capital Ratios:</p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><strong>50% Non-Discretionary (Needs):</strong> Rent, nutrition, essential utilities, and transit.</li>
                <li><strong>30% Discretionary (Wants):</strong> Dining out, entertainment, and lifestyle.</li>
                <li><strong>20% Capital Reserve (Savings):</strong> Cash buffer, debt liquidation, and index SIPs.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Needs Card */}
              <div className="glass-panel rounded-3xl p-5 border-t-4 border-t-sky-400 border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase mb-1 font-wallstreet">
                  <span>50% Needs</span>
                  <span>Mandatory</span>
                </div>
                <div className="text-2xl font-black text-white font-data mt-2">
                  {formatCurrency(Math.round(bIncome * 0.5), sym, true)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Housing, groceries, electricity, medical baseline, insurance.
                </p>
              </div>

              {/* Wants Card */}
              <div className="glass-panel rounded-3xl p-5 border-t-4 border-t-amber-400 border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase mb-1 font-wallstreet">
                  <span>30% Wants</span>
                  <span>Discretionary</span>
                </div>
                <div className="text-2xl font-black text-white font-data mt-2">
                  {formatCurrency(Math.round(bIncome * 0.3), sym, true)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Dining, entertainment, streaming, travel, recreation.
                </p>
              </div>

              {/* Savings Card */}
              <div className="glass-panel rounded-3xl p-5 border-t-4 border-t-emerald-400 border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase mb-1 font-wallstreet">
                  <span>20% Capital</span>
                  <span>Reserves</span>
                </div>
                <div className="text-2xl font-black text-white font-data mt-2">
                  {formatCurrency(Math.round(bIncome * 0.2), sym, true)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Broad market index funds, emergency cash, debt liquidation.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <h4 className="text-sm font-bold text-white font-wallstreet mb-2">High-Cost Living Adjustment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If metropolitan housing costs require 60% of take-home pay, adjust to <strong>60/20/20</strong> by compressing discretionary expenditure. The vital discipline is defending your 20% capital reserve allocation against lifestyle creep.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: EMERGENCY FUND */}
      {activeTool === "emergency" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Defensive Liquidity Moat
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Monthly Mandatory Survival Expenditures (Needs only)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-emerald-400 font-data">{sym}</span>
                <input
                  type="number"
                  min="2000"
                  step="500"
                  value={efMonthlyExpense}
                  onChange={(e) => setEfMonthlyExpense(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl pl-8 pr-4 py-3 text-sm text-white font-data focus:border-emerald-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Coverage Horizon: <strong className="text-white">{efMonths} Months</strong>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 9].map((m) => (
                  <button
                    key={m}
                    onClick={() => setEfMonths(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      efMonths === m
                        ? "bg-emerald-950/60 border-emerald-400 text-emerald-300"
                        : "bg-[#0E121B] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {m} Months {m === 6 ? "(Standard)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Currently Available in Liquid Cash / Risk-Free Deposits
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-emerald-400 font-data">{sym}</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={efCurrentSavings}
                  onChange={(e) => setEfCurrentSavings(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl pl-8 pr-4 py-3 text-sm text-white font-data focus:border-emerald-400 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet">Reserve Adequacy</h3>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0E121B] to-slate-900 border border-emerald-500/30 text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold font-wallstreet">
                Target Fund Size ({efMonths} Months)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-data mt-1 mb-2">
                {formatCurrency(efTarget, sym, true)}
              </div>

              <div className="w-full bg-[#080B10] h-3 rounded-full overflow-hidden border border-slate-800 mt-4 mb-2">
                <div
                  style={{ width: `${efProgressPct}%` }}
                  className={`h-full transition-all duration-500 ${
                    efProgressPct >= 100 ? "bg-emerald-400" : "bg-gradient-to-r from-amber-500 to-amber-300"
                  }`}
                />
              </div>
              <span className="text-xs text-slate-400 font-data">
                {efProgressPct}% Funded ({formatCurrency(efCurrentSavings, sym, true)} of {formatCurrency(efTarget, sym, true)})
              </span>
            </div>

            {efGap > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                <strong>Deficit: {formatCurrency(efGap, sym, true)}</strong>. To achieve full solvency in 6 months, allocate approximately <strong>{formatCurrency(Math.round(efGap / 6), sym, true)}/month</strong> toward your defensive liquidity cushion.
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Defensive Moat Secured:</strong> You have satisfied your emergency liquidity target. You may now deploy excess cash flow into long-term compounding assets.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 4: LOAN / DEBT EMI */}
      {activeTool === "emi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-400" />
              Liability & EMI Amortization
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-400">Principal Borrowed</span>
                <span className="text-white font-data text-sm">{formatCurrency(emiPrincipal, sym, true)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Annual Interest Rate (% p.a.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    step="0.25"
                    value={emiRate}
                    onChange={(e) => setEmiRate(Math.max(1, Math.min(45, Number(e.target.value))))}
                    className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2.5 text-sm text-white font-data focus:border-rose-400 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  min="6"
                  max="120"
                  step="6"
                  value={emiTenureMonths}
                  onChange={(e) => setEmiTenureMonths(Math.max(6, Math.min(120, Number(e.target.value))))}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2.5 text-sm text-white font-data focus:border-rose-400 outline-none"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <span className="block text-white font-semibold font-wallstreet">Typical Annual Liability Costs:</span>
              <div className="flex gap-2 flex-wrap text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Education Loan: 8-10%</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Personal Loan: 12-16%</span>
                <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/25">Credit Card Debt: 36-42%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/20">
            <h3 className="text-lg font-bold text-white font-wallstreet">Amortization Overview</h3>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 via-[#0E121B] to-slate-900 border border-rose-500/30 text-center">
              <span className="text-xs uppercase tracking-wider text-rose-300 font-bold font-wallstreet">
                Monthly Debt Service Payment
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-data mt-1 mb-2">
                {formatCurrency(emiResult.emi, sym, true)}
              </div>
              <span className="text-xs text-slate-400">
                For {emiTenureMonths} months ({Math.round((emiTenureMonths / 12) * 10) / 10} years)
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Principal Amount Borrowed</span>
                <span className="text-white font-data">{formatCurrency(emiPrincipal, sym, true)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-300">Total Interest Paid to Lender</span>
                <span className="text-rose-400 font-data font-bold">+{formatCurrency(emiResult.totalInterest, sym, true)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-800">
                <span className="text-white">Cumulative Amortization Paid</span>
                <span className="text-white font-data text-sm">{formatCurrency(emiResult.totalPayment, sym, true)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
