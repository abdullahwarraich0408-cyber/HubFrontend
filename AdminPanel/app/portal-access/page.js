"use client";

import { useState, useEffect } from "react";
import {
  Envelope,
  Lock,
  ShieldCheck,
  SquaresFour,
  ArrowRight,
  Info,
  WarningCircle,
  ClockCountdown,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { post } from "@/lib/api/client";
import {
  setAdminSession,
  getRememberedEmail,
} from "@/lib/auth/adminSession";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionExpiryReason, setSessionExpiryReason] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remembered = getRememberedEmail();
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }

      const params = new URLSearchParams(window.location.search);
      const isExpired = params.get("expired") === "true";

      if (isExpired) {
        const reason = params.get("reason") || "session_expired";
        setSessionExpiryReason(reason);

        const messages = {
          idle: "Your session timed out due to 30 minutes of inactivity.",
          logged_out: "You were logged out from another window or device.",
          revoked: "Your session was terminated from the security dashboard.",
          unauthorized: "Access denied. Administrator privileges required.",
          no_session: "Please log in with administrator credentials to access the console.",
          session_expired: "Your session has expired. Please log in again.",
        };

        const msg = messages[reason] || messages.session_expired;
        toast.error(msg);
      }
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await post("/auth/login", { email: email.trim().toLowerCase(), password });

      const user = response?.user || response?.data?.user;
      const tokens = response?.tokens || response?.data?.tokens;

      if (!user || user.role !== "admin") {
        try {
          await post("/auth/logout");
        } catch (_) {}
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      setAdminSession({
        token: tokens?.accessToken,
        refreshToken: tokens?.refreshToken,
        user,
        rememberMe,
        email: email.trim().toLowerCase(),
      });

      toast.success("Admin access granted. Welcome to the portal.");
      window.location.replace("/admin");
    } catch (err) {
      toast.error(err.message || "Authentication failed. Invalid credentials.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[var(--color-surface-subtle)] relative overflow-hidden font-[var(--font-plus-jakarta-sans)]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-light)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-brand-primary)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] flex overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Left brand panel */}
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] p-12 relative flex-col justify-between overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-white/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-60" />

          <div className="relative z-10 mt-4">
            <div className="mb-8">
              <img
                src="/images/medzoos-wordmark-on-dark.png"
                alt="Medzoos"
                className="h-9 sm:h-10 md:h-11 w-auto object-contain mb-6"
              />
            </div>
            <h2 className="text-[36px] font-[var(--font-heading)] font-extrabold text-white mb-4 leading-[1.2] tracking-tight">
              Admin Portal <br /> for Medzoos.
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-[320px]">
              Manage vendors, doctors, labs, orders, and platform operations from one secure console.
            </p>
          </div>

          <div className="relative z-10 space-y-5 mb-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <ShieldCheck size={20} weight="fill" className="text-[var(--color-brand-light)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Restricted administrator access</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <SquaresFour size={20} weight="fill" className="text-white" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Full marketplace oversight</span>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full lg:w-[55%] p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <img
              src="/images/medzoos-mark.png"
              alt="Medzoos"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain mb-4 mx-auto md:mx-0"
            />
            <h1 className="text-[30px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-2 tracking-tight">
              Admin Login
            </h1>
            <p className="text-[14px] text-[var(--color-neutral-500)]">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>

          {sessionExpiryReason && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
              <ClockCountdown size={20} weight="duotone" className="text-amber-600 shrink-0" />
              <span>
                {sessionExpiryReason === "idle" && "You were automatically signed out due to 30 minutes of inactivity."}
                {sessionExpiryReason === "logged_out" && "You were signed out from another tab or window."}
                {sessionExpiryReason === "revoked" && "Your login session was terminated from the security dashboard."}
                {sessionExpiryReason === "unauthorized" && "You do not have administrator permissions for this area."}
                {sessionExpiryReason === "no_session" && "Please enter your administrator credentials to sign in."}
                {sessionExpiryReason === "session_expired" && "Your previous session has expired. Please sign in again."}
              </span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <Input
              label="Administrator Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medzoos.com"
              leftIcon={<Envelope size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock size={18} />}
              required
            />

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[var(--color-neutral-300)] bg-white peer-checked:bg-[var(--color-brand-primary)] peer-checked:border-[var(--color-brand-primary)] transition-all flex items-center justify-center group-hover:border-[var(--color-brand-primary)]">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-[var(--color-neutral-600)] group-hover:text-[var(--color-neutral-900)] transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] text-[14px] font-bold mt-2 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white transition-all shadow-[0_4px_12px_rgba(23,97,142,0.15)] hover:shadow-[0_6px_16px_rgba(23,97,142,0.25)] flex justify-center items-center group border-none"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--color-neutral-200)] flex items-center justify-center gap-2 text-[12px] font-semibold text-[var(--color-neutral-500)]">
            <ShieldCheck size={14} weight="fill" className="text-[var(--color-brand-primary)]" />
            Restricted access · Encrypted connection
          </div>
        </div>
      </div>
    </div>
  );
}
