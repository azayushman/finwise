import { describe, it, expect } from 'vitest';
import { 
  calculateSIP, 
  calculateCompoundInterest, 
  calculateEMI, 
  calculateZeroBaseBudget 
} from '../calculations';

describe('SIP Calculator', () => {
  it('calculates future value, total invested, and estimated returns accurately', () => {
    // 10,000 per month, 12% annual return, 10 years
    const { futureValue, totalInvested, estimatedReturns } = calculateSIP(10000, 12, 10);
    expect(totalInvested).toBe(1200000);
    // Formula check: FV = 10000 * (((1+0.01)^120 - 1) / 0.01) * 1.01 ≈ 2323390.81
    expect(futureValue).toBeCloseTo(2323390.81, 1);
    expect(estimatedReturns).toBeCloseTo(1123390.81, 1);
  });

  it('handles 0% interest rate edge case', () => {
    const { futureValue, totalInvested, estimatedReturns } = calculateSIP(5000, 0, 5);
    expect(totalInvested).toBe(300000);
    expect(futureValue).toBe(300000);
    expect(estimatedReturns).toBe(0);
  });

  it('handles 0 tenure edge case', () => {
    const { futureValue, totalInvested, estimatedReturns } = calculateSIP(5000, 10, 0);
    expect(totalInvested).toBe(0);
    expect(futureValue).toBe(0);
    expect(estimatedReturns).toBe(0);
  });
});

describe('Compound Interest Calculator', () => {
  it('calculates monthly compounding accurately', () => {
    // 10,000 principal, 5% annual rate, 10 years, monthly compounding
    const { futureValue } = calculateCompoundInterest(10000, 5, 10, 12);
    // FV = 10000 * (1 + 0.05/12)^(12*10) ≈ 16470.09
    expect(futureValue).toBeCloseTo(16470.09, 1);
  });

  it('calculates quarterly compounding accurately', () => {
    // 10,000 principal, 5% annual rate, 10 years, quarterly compounding
    const { futureValue } = calculateCompoundInterest(10000, 5, 10, 4);
    // FV = 10000 * (1 + 0.05/4)^(4*10) ≈ 16436.19
    expect(futureValue).toBeCloseTo(16436.19, 1);
  });

  it('calculates annual compounding accurately', () => {
    // 10,000 principal, 5% annual rate, 10 years, annual compounding
    const { futureValue } = calculateCompoundInterest(10000, 5, 10, 1);
    // FV = 10000 * (1 + 0.05)^10 ≈ 16288.94
    expect(futureValue).toBeCloseTo(16288.94, 1);
  });
});

describe('EMI Calculator', () => {
  it('calculates EMI against known amortization schedule', () => {
    // 1,000,000 principal, 10% annual rate, 10 years
    const emi = calculateEMI(1000000, 10, 10);
    // EMI ≈ 13215.07
    expect(emi).toBeCloseTo(13215.07, 1);
  });

  it('handles 0% interest rate gracefully', () => {
    // 1,200,000 principal, 0% rate, 10 years (120 months) -> 10,000/mo
    const emi = calculateEMI(1200000, 0, 10);
    expect(emi).toBeCloseTo(10000, 2);
  });
});

describe('Zero-Base Budget 50/30/20', () => {
  it('splits income perfectly into needs, wants, and savings', () => {
    const budget = calculateZeroBaseBudget(5000);
    expect(budget.needs).toBe(2500); // 50%
    expect(budget.wants).toBe(1500); // 30%
    expect(budget.savings).toBe(1000); // 20%
  });

  it('handles zero income', () => {
    const budget = calculateZeroBaseBudget(0);
    expect(budget.needs).toBe(0);
    expect(budget.wants).toBe(0);
    expect(budget.savings).toBe(0);
  });
});

describe('Edge Cases & Defense Guards', () => {
  it('clamps extremely large inputs', () => {
    const { futureValue } = calculateCompoundInterest(1000000000, 5, 10, 1); // Max 100,000,000
    // Expected to clamp principal to 100M: FV = 100,000,000 * (1.05)^10 ≈ 162889462
    expect(futureValue).toBeCloseTo(162889462.6, 0);
  });

  it('clamps invalid/NaN inputs to fallback values', () => {
    const { futureValue } = calculateSIP(Number('invalid'), 10, 10);
    expect(futureValue).toBe(0);
  });

  it('handles negative inputs by clamping to 0', () => {
    const emi = calculateEMI(-5000, -10, -5);
    expect(emi).toBe(0);
  });
});
