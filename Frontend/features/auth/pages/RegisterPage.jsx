"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Envelope, Lock, User, Phone, GoogleLogo, AppleLogo, Pill, ShieldCheck, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { register } from "@/app/store/authSlice";
import { toast } from "sonner";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirectTo = searchParams.get("redirect") || "/";
  const { openSignIn } = useAuthModal();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      await dispatch(register(formData)).unwrap();
      toast.success("Account created successfully!");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-subtle)] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-light)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-status-info)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] flex overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Left Side: Brand Visual (Hidden on mobile) */}
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[var(--color-ink-900)] to-[var(--color-neutral-900)] p-12 relative flex-col justify-between overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[var(--color-brand-primary)]/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[var(--color-brand-primary)]/20 rounded-full blur-[60px]" />
          
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-60"></div>

          <div className="relative z-10 mt-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/10 shadow-lg">
              <ShieldCheck size={24} weight="fill" className="text-[var(--color-status-success)]" />
            </div>
            <h2 className="text-[36px] font-[var(--font-heading)] font-extrabold text-white mb-4 leading-[1.2] tracking-tight">
              Create your <br /> Account.
            </h2>
            <p className="text-[15px] text-[var(--color-neutral-300)] leading-relaxed max-w-[320px]">
              Join PharmaHub today and take control of your healthcare with ease, security, and convenience.
            </p>
          </div>

          <div className="relative z-10 space-y-5 mb-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <CheckCircle size={20} weight="fill" className="text-[var(--color-brand-light)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">100% Authentic Medicines</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <Pill size={20} weight="fill" className="text-[var(--color-brand-primary)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Extensive pharmacy network</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[55%] p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-[30px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-2 tracking-tight">
              Register
            </h1>
            <p className="text-[14px] text-[var(--color-neutral-500)]">
              Fill in your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                leftIcon={<User size={18} />}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                leftIcon={<Phone size={18} />}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              leftIcon={<Envelope size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              leftIcon={<Lock size={18} />}
              required
            />

            <div className="pt-2 pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="peer sr-only"
                    required
                  />
                  <div className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[var(--color-neutral-300)] bg-white peer-checked:bg-[var(--color-brand-primary)] peer-checked:border-[var(--color-brand-primary)] transition-all flex items-center justify-center group-hover:border-[var(--color-brand-primary)]">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-[var(--color-neutral-600)] group-hover:text-[var(--color-neutral-900)] transition-colors">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-[48px] text-[14px] font-bold mt-2 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white transition-all shadow-[0_4px_12px_rgba(11,110,114,0.15)] hover:shadow-[0_6px_16px_rgba(11,110,114,0.25)] flex justify-center items-center group border-none">
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-neutral-200)]"></div>
            </div>
            <div className="relative flex justify-center text-[12px]">
              <span className="px-4 bg-white text-[var(--color-neutral-400)] font-medium uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
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

          <div className="mt-6 text-center md:text-left flex items-center justify-between">
            <p className="text-[14px] text-[var(--color-neutral-600)]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => openSignIn({ redirect: redirectTo })}
                className="text-[var(--color-brand-primary)] font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Sign in
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
