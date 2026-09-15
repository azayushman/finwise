"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Guard tracking with the environment variable for production deployments
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true"
    ) {
      return;
    }

    const { name, value, rating } = metric;
    
    if (process.env.NODE_ENV === "development") {
      // Clean, non-intrusive local development logging
      const valStr = name === "CLS" ? value.toFixed(4) : (value / 1000).toFixed(2) + "s";
      console.log(`[Web Vitals] Metric: ${name} | Value: ${valStr} | Rating: ${rating}`);
    } else {
      // Production tracking logic (e.g., navigator.sendBeacon)
      // const body = JSON.stringify(metric);
      // if (navigator.sendBeacon) {
      //   navigator.sendBeacon('/api/analytics', body);
      // } else {
      //   fetch('/api/analytics', { body, method: 'POST', keepalive: true }).catch(() => {});
      // }
    }
  });

  return null;
}
