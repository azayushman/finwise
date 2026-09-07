"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

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
        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)] glass-surface"
        aria-hidden="true"
      >
        <svg
          width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round"
        >
          <polyline points="2 17 9 10 13 14 22 5" />
          <line x1="16" y1="5" x2="22" y2="5" />
          <line x1="22" y1="5" x2="22" y2="11" />
        </svg>
      </div>
      <span className="text-2xl font-bold tracking-tight text-white">
        Fin<span className="text-[#8B5CF6]">Wise</span>
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
        <label htmlFor={id} className="text-sm font-semibold text-slate-200">{label}</label>
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
          className={`w-full px-4 py-3 text-sm text-white glass-surface rounded-xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/60 ${
            hasError
              ? "border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              : "hover:border-white/10 focus:border-[#8B5CF6]/50 focus:ring-2 focus:ring-[#8B5CF6]/20"
          } ${rightSlot ? "pr-11" : ""}`}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
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
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState<FormState>({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const fe = getFieldErrors(form);
    setErrors(fe);
    if (fe.email || fe.password) return;

    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          throw new Error("This email is already registered.");
        }
        setSuccessMessage("Account created successfully. You can now sign in.");
        setSubmitSuccess(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ general: err.message || "An unexpected error occurred. Please try again." });
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasValidationErrors =
    (touched.email && Boolean(errors.email)) ||
    (touched.password && Boolean(errors.password));

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setTouched({});
    setForm({ email: "", password: "", rememberMe: false });
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Decorative ambient lighting specific to the login page */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none blur-[80px]"
           style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} />
      <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none blur-[80px]"
           style={{ background: "radial-gradient(circle, #4F46E5, transparent 70%)" }} />

      {/* Main Glass Authentication Card */}
      <div
        className="relative w-full max-w-[440px] glass-panel rounded-3xl animate-scale-in flex flex-col"
        role="main"
        aria-label={mode === "login" ? "Login form" : "Signup form"}
      >
        {/* Success overlay */}
        {submitSuccess && mode === "signup" && (
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center z-20 animate-scale-in glass-panel backdrop-blur-2xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(109,93,251,0.5)]"
                 style={{ background: "linear-gradient(135deg, #6D5DFB, #4F46E5)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Welcome!</h2>
            <p className="text-sm text-[#94A3B8] text-center max-w-[260px] mb-6">
              {successMessage}
            </p>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setMode("login");
              }}
              className="text-sm font-semibold transition-colors hover:text-white text-[#A78BFA]"
            >
              ← Proceed to login
            </button>
          </div>
        )}

        <div className="px-8 pt-10 pb-8 flex-1">
          {/* Branding */}
          <div className="text-center mb-8">
            <FinWiseLogo />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              {mode === "login" ? "Sign in to your FinWise account" : "Start your financial journey today"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#07111F]/50 p-1 rounded-xl mb-8 border border-white/5">
            <button
              type="button"
              onClick={() => mode !== "login" && toggleMode()}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "glass-surface text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
              aria-pressed={mode === "login"}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => mode !== "signup" && toggleMode()}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "signup"
                  ? "glass-surface text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
              aria-pressed={mode === "signup"}
            >
              Create account
            </button>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            id="google-login-btn"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/10 rounded-xl text-sm font-semibold text-slate-200 glass-surface hover:bg-white/5 transition-all duration-300 mb-5 group"
            onClick={() => setErrors({ general: "Google sign-in will be available soon." })}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <GoogleIcon />
            </div>
            Continue with Google
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* General error banner */}
          {errors.general && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm glass-surface border-amber-500/30"
              role="alert" aria-live="assertive"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-amber-200/90">{errors.general}</span>
            </div>
          )}

          {/* Email / password form */}
          <form onSubmit={handleSubmit} noValidate aria-label={mode === "login" ? "Email sign-in form" : "Email sign-up form"}>
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
                placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                hint={
                  mode === "login" ? (
                    <button
                      type="button"
                      className="text-xs font-semibold transition-colors hover:text-white text-[#A78BFA]"
                      onClick={() => setErrors((prev) => ({ ...prev, general: "Password reset will be available soon." }))}
                    >
                      Forgot password?
                    </button>
                  ) : null
                }
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />
            </div>

            {/* Remember me */}
            {mode === "login" && (
              <div className="flex items-center gap-2.5 mt-5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={form.rememberMe}
                  id="remember-me"
                  onClick={() => handleChange("rememberMe", !form.rememberMe)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    form.rememberMe ? "border-transparent bg-[#6D5DFB]" : "border-white/20 glass-surface hover:border-white/40"
                  }`}
                >
                  {form.rememberMe && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <label
                  htmlFor="remember-me"
                  className="text-sm text-[#94A3B8] hover:text-white transition-colors cursor-pointer select-none"
                  onClick={() => handleChange("rememberMe", !form.rememberMe)}
                >
                  Remember me for 30 days
                </label>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || hasValidationErrors}
              id="login-submit-btn"
              className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(109,93,251,0.4)] active:translate-y-0 bg-[#6D5DFB] border border-white/10"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </span>
              ) : (
                mode === "login" ? "Sign in to FinWise" : "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Trust strip / Footer */}
        <div className="px-8 py-4 rounded-b-3xl border-t border-white/5 flex items-center justify-center gap-6 flex-wrap glass-surface">
          {[
            { icon: "🔒", label: "Secure & encrypted" },
            { icon: "🚫", label: "No spam, ever" },
            { icon: "✨", label: "Free forever" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
