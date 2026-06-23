"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Envelope, Lock, GoogleLogo, AppleLogo, Stethoscope, ShieldCheck, CalendarCheck, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { toast } from "sonner";

import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { partnerAuthApi } from "@/lib/api/index";

export function DoctorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("expired=true")) {
      const timer = setTimeout(() => {
        toast.error("Your session has expired. Please log in again.");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await partnerAuthApi.login("doctor", email, password);
      toast.success("Welcome back, Doctor!");
      router.push(partnerRoutes.doctor.dashboard);
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-subtle)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-light)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-status-info)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] flex overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] p-12 relative flex-col justify-between overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-white/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-60"></div>

          <div className="relative z-10 mt-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/10 shadow-lg">
              <Stethoscope size={24} weight="fill" className="text-white" />
            </div>
            <h2 className="text-[36px] font-[var(--font-heading)] font-extrabold text-white mb-4 leading-[1.2] tracking-tight">
              Doctor Portal <br /> for PharmaHub.
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-[320px]">
              Manage appointments, view patient schedules, and provide quality healthcare through our platform.
            </p>
          </div>

          <div className="relative z-10 space-y-5 mb-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <ShieldCheck size={20} weight="fill" className="text-[var(--color-brand-light)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Verified doctor credentials</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <CalendarCheck size={20} weight="fill" className="text-white" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Real-time appointment management</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-[30px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-2 tracking-tight">
              Doctor Login
            </h1>
            <p className="text-[14px] text-[var(--color-neutral-500)]">
              Enter your credentials to access your doctor dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Doctor Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@pharmahub.com"
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
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-[var(--color-neutral-600)] group-hover:text-[var(--color-neutral-900)] transition-colors">Remember me</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-[48px] text-[14px] font-bold mt-2 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white transition-all shadow-[0_4px_12px_rgba(11,110,114,0.15)] hover:shadow-[0_6px_16px_rgba(11,110,114,0.25)] flex justify-center items-center group border-none">
              {loading ? "Signing in..." : "Login to Dashboard"}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-neutral-200)]"></div>
            </div>
            <div className="relative flex justify-center text-[12px]">
              <span className="px-4 bg-white text-[var(--color-neutral-400)] font-medium uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="w-full h-[44px] text-[13px] font-semibold bg-white border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] shadow-sm text-[var(--color-neutral-700)] hover:text-black">
              <GoogleLogo size={18} className="mr-2 text-[#DB4437]" weight="bold" />
              Google
            </Button>
            <Button variant="secondary" className="w-full h-[44px] text-[13px] font-semibold bg-white border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] shadow-sm text-[var(--color-neutral-700)] hover:text-black">
              <AppleLogo size={18} className="mr-2 text-black" weight="fill" />
              Apple
            </Button>
          </div>

          <div className="mt-8 text-center md:text-left">
            <p className="text-[14px] text-[var(--color-neutral-600)]">
              Not registered yet?{" "}
              <Link href="/contact" className="text-[var(--color-brand-primary)] font-semibold hover:underline decoration-2 underline-offset-4">
                Join as a Doctor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
