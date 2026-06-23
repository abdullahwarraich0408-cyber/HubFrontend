"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Envelope,
  Lock,
  GoogleLogo,
  AppleLogo,
  Pill,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { api } from "@/lib/api";
import { login } from "@/app/store/authSlice";
import { toast } from "sonner";

export function SignInForm({
  redirectTo = "/",
  onSuccess,
  variant = "page",
  showBrandPanel = true,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isModal = variant === "modal";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(login({ email, password })).unwrap();

      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      if (guestCart.length > 0) {
        await api.cart.merge(guestCart);
        localStorage.removeItem("guest_cart");
      }

      toast.success("Welcome back!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-updated"));
      }
      onSuccess?.();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <div
      className={`w-full bg-white flex overflow-hidden ${
        isModal
          ? "flex-col lg:flex-row min-h-0"
          : "max-w-[960px] rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] animate-in fade-in zoom-in-95 duration-500"
      }`}
    >
      {showBrandPanel && (
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[var(--color-ink-900)] to-[var(--color-neutral-900)] p-10 relative flex-col justify-between overflow-hidden shrink-0">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[var(--color-brand-primary)]/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[var(--color-brand-primary)]/20 rounded-full blur-[60px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-60" />

          <div className="relative z-10 mt-2">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/10 shadow-lg">
              <Pill size={24} weight="fill" className="text-[var(--color-brand-light)]" />
            </div>
            <h2 className="text-[32px] font-[var(--font-heading)] font-extrabold text-white mb-3 leading-[1.2] tracking-tight">
              Welcome to <br /> PharmaHub.
            </h2>
            <p className="text-[14px] text-[var(--color-neutral-300)] leading-relaxed max-w-[320px]">
              Access your digital prescriptions, track deliveries, and manage your family&apos;s health securely.
            </p>
          </div>

          <div className="relative z-10 space-y-4 mb-2">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <ShieldCheck size={20} weight="fill" className="text-[var(--color-status-success)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Bank-grade data security</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <Truck size={20} weight="fill" className="text-[var(--color-brand-light)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Fast, reliable delivery</span>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full ${showBrandPanel ? "lg:w-[55%]" : ""} p-6 md:p-10 flex flex-col justify-center`}>
        <div className={`mb-6 ${isModal ? "text-left" : "text-center md:text-left"}`}>
          <h1 className="text-[26px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-2 tracking-tight">
            Sign In
          </h1>
          <p className="text-[14px] text-[var(--color-neutral-500)]">
            Enter your details to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
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

          <div className="flex items-center justify-between pt-1 pb-1">
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
            <Link
              href="/forgot-password"
              className="text-[13px] text-[var(--color-brand-primary)] font-semibold hover:text-[var(--color-brand-dark)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] text-[14px] font-bold mt-1 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white transition-all shadow-[0_4px_12px_rgba(11,110,114,0.15)] hover:shadow-[0_6px_16px_rgba(11,110,114,0.25)] flex justify-center items-center group border-none"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-neutral-200)]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="px-4 bg-white text-[var(--color-neutral-400)] font-medium uppercase tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="w-full h-[44px] text-[13px] font-semibold bg-white border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] shadow-sm text-[var(--color-neutral-700)] hover:text-black"
          >
            <GoogleLogo size={18} className="mr-2 text-[#DB4437]" weight="bold" />
            Google
          </Button>
          <Button
            variant="secondary"
            className="w-full h-[44px] text-[13px] font-semibold bg-white border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] shadow-sm text-[var(--color-neutral-700)] hover:text-black"
          >
            <AppleLogo size={18} className="mr-2 text-black" weight="fill" />
            Apple
          </Button>
        </div>

        <p className="mt-6 text-[14px] text-[var(--color-neutral-600)] text-center md:text-left">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="text-[var(--color-brand-primary)] font-semibold hover:underline decoration-2 underline-offset-4"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );

  if (isModal) return card;

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-subtle)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-light)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-status-info)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-[960px]">{card}</div>
    </div>
  );
}
