"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (amount: number, noFractions?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = localStorage.getItem("finwise_currency");
    if (stored === "USD" || stored === "INR" || stored === "EUR" || stored === "GBP") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("finwise_currency", newCurrency);
  }, []);

  const formatCurrency = useCallback(
    (amount: number, noFractions: boolean = false) => {
      // If we are server-side rendering, default to a safe non-breaking format without strict locale checking 
      // (though the mismatch might cause hydration warning, `mounted` usually handles UI rendering conditionally if needed).
      const locale = CURRENCY_LOCALES[currency] || "en-US";
      
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: noFractions ? 0 : 2,
        maximumFractionDigits: noFractions ? 0 : 2,
      }).format(amount);
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {/* 
        To prevent hydration mismatch on currency format since localStorage is only available on client:
        We technically should hide numbers or use a skeleton before mount if strict consistency is needed. 
        For simplicity, we render immediately. The user might see USD flash to INR on first load.
      */}
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
