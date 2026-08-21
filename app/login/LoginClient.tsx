"use client";

import { useState, useId } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FinWiseLogo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
        aria-hidden="true"
      >
        <svg
          width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="#00C896" strokeWidth="2.2" strokeLinecap="round"
        >
          <polyline points="2 17 9 10 13 14 22 5" />
          <line x1="16" y1="5" x2="22" y2="5" />
          <line x1="22" y1="5" x2="22" y2="11" />
        </svg>
      </div>
      <span className="text-2xl font-bold tracking-tight text-slate-900">
        Fin<span style={{ color: "#00C896" }}>Wise</span>
      </span>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
  autoComplete: string;
  rightSlot?: React.ReactNode;
  hint?: React.ReactNode;
}

function InputField({
  id, label, type, value, onChange, onBlur,
  error, placeholder, autoComplete, rightSlot, hint,
}: InputFieldProps) {
  const hasError = Boolean(error);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
        {hint}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
          } ${rightSlot ? "pr-11" : ""}`}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ── Main client component ──────────────────────────────────────────────────

export function LoginClient() {
  const [form, setForm] = useState<FormState>({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emailId    = useId();
  const passwordId = useId();

  function getFieldErrors(state: FormState): FormErrors {
    return {
      email:    validateEmail(state.email),
      password: validatePassword(state.password),
    };
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, ...getFieldErrors(form) }));
  }

  function handleChange(field: keyof FormState, value: string | boolean) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const fe = getFieldErrors(next);
      setErrors((prev) => ({ ...prev, [field]: fe[field as keyof FormErrors] }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const fe = getFieldErrors(form);
    setErrors(fe);
    if (fe.email || fe.password) return;

    // No real auth — backend integration is a separate task
    setIsSubmitting(true);
    setErrors({});
    setTimeout(() => { setIsSubmitting(false); setSubmitSuccess(true); }, 1400);
  }

  const hasValidationErrors =
    (touched.email && Boolean(errors.email)) ||
    (touched.password && Boolean(errors.password));

  return (
    <div
      className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F8FAFC 0%, #EEF5FC 100%)" }}
    >
      {/* Decorative orbs */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
           style={{ background: "radial-gradient(circle, #00C896, transparent 70%)", filter: "blur(80px)" }} />
      <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
           style={{ background: "radial-gradient(circle, #1E3A5F, transparent 70%)", filter: "blur(80px)" }} />

      {/* Card */}
      <div
        className="relative w-full max-w-[440px] bg-white border border-slate-200 rounded-3xl shadow-[0_8px_40px_rgba(10,22,40,0.10)] animate-scale-in"
        role="main"
        aria-label="Login form"
      >
        {/* Success overlay */}
        {submitSuccess && (
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center z-20 animate-scale-in"
               style={{ background: "rgba(255,255,255,0.97)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                 style={{ background: "linear-gradient(135deg, #00C896, #00A87E)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">You&apos;re in!</h2>
            <p className="text-sm text-slate-500 text-center max-w-[260px] mb-6">
              Auth backend integration is pending. This confirms the form flow works correctly end-to-end.
            </p>
            <button
              onClick={() => { setSubmitSuccess(false); setForm({ email: "", password: "", rememberMe: false }); setTouched({}); setErrors({}); }}
              className="text-sm font-semibold transition-colors hover:underline"
              style={{ color: "#00A87E" }}
            >
              ← Back to login
            </button>
          </div>
        )}

        <div className="px-8 pt-10 pb-8">
          {/* Branding */}
          <div className="text-center mb-8">
            <FinWiseLogo />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your FinWise account</p>
          </div>

          {/* Google SSO — UI only */}
          <button
            type="button"
            id="google-login-btn"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 mb-5"
            onClick={() => setErrors({ general: "Google sign-in will be available once auth is configured." })}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* General error / info banner */}
          {errors.general && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
              role="alert" aria-live="assertive"
              style={{ background: "#FEF3C7", border: "1px solid #FCD34D", color: "#92400E" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email / password form */}
          <form onSubmit={handleSubmit} noValidate aria-label="Email sign-in form">
            <div className="space-y-4">
              <InputField
                id={emailId}
                label="Email address"
                type="email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <InputField
                id={passwordId}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(v) => handleChange("password", v)}
                onBlur={() => handleBlur("password")}
                error={touched.password ? errors.password : undefined}
                placeholder="Enter your password"
                autoComplete="current-password"
                hint={
                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors hover:underline"
                    style={{ color: "#00A87E" }}
                    onClick={() => setErrors((prev) => ({ ...prev, general: "Password reset will be available once auth is configured." }))}
                  >
                    Forgot password?
                  </button>
                }
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5 mt-5">
              <button
                type="button"
                role="checkbox"
                aria-checked={form.rememberMe}
                id="remember-me"
                onClick={() => handleChange("rememberMe", !form.rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                  form.rememberMe ? "border-transparent" : "border-slate-300 bg-white hover:border-slate-400"
                }`}
                style={form.rememberMe ? { background: "#00C896", borderColor: "#00C896" } : {}}
              >
                {form.rememberMe && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <label
                htmlFor="remember-me"
                className="text-sm text-slate-600 cursor-pointer select-none"
                onClick={() => handleChange("rememberMe", !form.rememberMe)}
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || hasValidationErrors}
              id="login-submit-btn"
              className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,200,150,0.32)] active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in to FinWise"
              )}
            </button>
          </form>

          {/* Sign-up link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "#00A87E" }}
              aria-label="Create a free FinWise account"
            >
              Create account — it&apos;s free
            </Link>
          </p>
        </div>

        {/* Trust strip */}
        <div className="px-8 py-4 rounded-b-3xl border-t border-slate-100 flex items-center justify-center gap-6 flex-wrap"
             style={{ background: "#F8FAFC" }}>
          {[
            { icon: "🔒", label: "Secure & encrypted" },
            { icon: "🚫", label: "No spam, ever" },
            { icon: "✨", label: "Free forever" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
