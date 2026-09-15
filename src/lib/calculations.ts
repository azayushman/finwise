export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function calculateSIP(monthlyInvestment: number, annualRate: number, years: number) {
  const p = clamp(monthlyInvestment, 0, 100_000_000);
  const rate = clamp(annualRate, 0, 100);
  const t = clamp(years, 0, 50);

  if (p === 0 || t === 0) return { futureValue: 0, totalInvested: 0, estimatedReturns: 0 };
  
  const totalInvested = p * t * 12;
  
  if (rate === 0) return { futureValue: totalInvested, totalInvested, estimatedReturns: 0 };

  const i = (rate / 100) / 12;
  const n = t * 12;

  let futureValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  if (!Number.isFinite(futureValue)) futureValue = totalInvested;

  return {
    futureValue,
    totalInvested,
    estimatedReturns: Math.max(0, futureValue - totalInvested)
  };
}

export function calculateCompoundInterest(principal: number, annualRate: number, years: number, frequency: 12 | 4 | 1) {
  const p = clamp(principal, 0, 100_000_000);
  const rate = clamp(annualRate, 0, 100);
  const t = clamp(years, 0, 50);

  if (p === 0 || t === 0) return { futureValue: p, totalInvested: p, estimatedReturns: 0 };
  if (rate === 0) return { futureValue: p, totalInvested: p, estimatedReturns: 0 };

  const r = rate / 100;
  const n = frequency;
  
  let futureValue = p * Math.pow(1 + r / n, n * t);
  if (!Number.isFinite(futureValue)) futureValue = p;

  return {
    futureValue,
    totalInvested: p,
    estimatedReturns: Math.max(0, futureValue - p)
  };
}

export function calculateEMI(principal: number, annualRate: number, years: number) {
  const p = clamp(principal, 0, 100_000_000);
  const rate = clamp(annualRate, 0, 100);
  const t = clamp(years, 0, 50);

  if (p === 0 || t === 0) return 0;
  if (rate === 0) return p / (t * 12);

  const r = (rate / 100) / 12;
  const n = t * 12;
  
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Number.isFinite(emi) ? emi : 0;
}

export function calculateZeroBaseBudget(income: number) {
  const inc = clamp(income, 0, 100_000_000);
  if (inc === 0) return { needs: 0, wants: 0, savings: 0 };

  return {
    needs: inc * 0.5,
    wants: inc * 0.3,
    savings: inc * 0.2
  };
}
