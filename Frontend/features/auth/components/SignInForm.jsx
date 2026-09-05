"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Envelope,
  Lock,
  Pill,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { cartApi } from "@/lib/api/index";
import { useAuth } from "@/lib/auth/AuthProvider";
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
  const { loginWithEmail } = useAuth();
  const isModal = variant === "modal";

  const handlePostLogin = async () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      if (guestCart.length > 0) {
        await cartApi.merge(guestCart);
        localStorage.removeItem("guest_cart");
      }
    } catch(err) {
      console.warn("Cart merge failed:", err);
    }
    
    toast.success("Welcome back!");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
    onSuccess?.();
    router.push(redirectTo);
    router.refresh();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      await handlePostLogin();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full bg-white/80 backdrop-blur-3xl flex overflow-hidden ${
        isModal
          ? "flex-col lg:flex-row min-h-0 rounded-[24px]"
          : "max-w-[1000px] rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-white/40"
      }`}
    >
      {showBrandPanel && (
        <div className="hidden lg:flex w-[48%] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-dark)] via-[var(--color-brand-primary)] to-[#0A4D50] z-0" />
          
          {/* Animated background elements */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[20%] w-[120%] h-[120%] bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-[100px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[20%] w-[120%] h-[120%] bg-gradient-to-tr from-[#00FFF0]/10 to-transparent rounded-full blur-[100px] pointer-events-none" 
          />
          
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA3KSIvPjwvc3ZnPg==')] opacity-100 z-0 mix-blend-overlay" />

          <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl mb-8 border border-white/20 shadow-2xl">
                <Pill size={28} weight="fill" className="text-white drop-shadow-md" />
              </div>
              <h2 className="text-[42px] font-[var(--font-heading)] font-black text-white mb-4 leading-[1.1] tracking-tight drop-shadow-sm">
                Health, <br /> Delivered.
              </h2>
              <p className="text-[16px] text-white/80 leading-relaxed max-w-[320px] font-medium drop-shadow-sm">
                Your trusted partner for prescriptions, lab tests, and complete family health management.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-5 text-white bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <ShieldCheck size={24} weight="fill" className="text-[#00FFF0]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold tracking-wide">Bank-grade security</h4>
                  <p className="text-[13px] text-white/70 mt-0.5">Your health data is safe</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-white bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <Truck size={24} weight="fill" className="text-[#00FFF0]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold tracking-wide">Fast delivery</h4>
                  <p className="text-[13px] text-white/70 mt-0.5">Meds delivered in minutes</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className={`w-full ${showBrandPanel ? "lg:w-[52%]" : ""} p-8 md:p-12 flex flex-col justify-center relative bg-white/70 z-10`}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`mb-8 ${isModal ? "text-left" : "text-center md:text-left"}`}
        >
          <h1 className="text-[32px] font-[var(--font-heading)] font-black text-[var(--color-ink-900)] mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[15px] text-[var(--color-neutral-500)] font-medium">
            Sign in to continue to your dashboard.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            leftIcon={<Envelope size={20} className="text-[var(--color-neutral-400)]" />}
            required
            className="h-12 bg-white/80 border-white/60 focus:bg-white transition-colors"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock size={20} className="text-[var(--color-neutral-400)]" />}
            required
            className="h-12 bg-white/80 border-white/60 focus:bg-white transition-colors"
          />

          <div className="flex items-center justify-between pt-1 pb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-[6px] border-[1.5px] border-[var(--color-neutral-300)] bg-white peer-checked:bg-[var(--color-brand-primary)] peer-checked:border-[var(--color-brand-primary)] transition-all flex items-center justify-center group-hover:border-[var(--color-brand-primary)]">
                  <motion.svg
                    initial={false}
                    animate={{ opacity: rememberMe ? 1 : 0, scale: rememberMe ? 1 : 0.5 }}
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              </div>
              <span className="text-[14px] font-medium text-[var(--color-neutral-600)] group-hover:text-[var(--color-neutral-900)] transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[14px] text-[var(--color-brand-primary)] font-bold hover:text-[var(--color-brand-dark)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
              disabled={loading}
            className="w-full h-[52px] text-[15px] font-bold mt-2 rounded-xl bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] hover:from-[var(--color-brand-dark)] hover:to-[#093f41] text-white transition-all shadow-[0_8px_20px_rgba(11,110,114,0.25)] hover:shadow-[0_12px_24px_rgba(11,110,114,0.35)] flex justify-center items-center group border-none hover:-translate-y-0.5"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1.5 transition-transform" />}
          </Button>
        </motion.form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-[15px] text-[var(--color-neutral-600)] text-center font-medium"
        >
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            onClick={() => onSuccess?.()}
            className="text-[var(--color-brand-primary)] font-bold hover:text-[var(--color-brand-dark)] transition-colors hover:underline decoration-2 underline-offset-4"
          >
            Create one now
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );

  if (isModal) return card;

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--color-brand-light)]/30 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--color-status-info)]/20 rounded-full blur-[100px] pointer-events-none" 
      />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[50px] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-[1000px]">{card}</div>
    </div>
  );
}
