"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, ArrowLeft, Key, ShieldCheck, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useRouter } from "next/navigation";
import { openSignInModal } from "@/lib/authModalEvents";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Password reset requested for", email);
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

          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/10 shadow-lg">
              <Key size={32} weight="fill" className="text-[var(--color-brand-light)]" />
            </div>
            <h2 className="text-[36px] font-[var(--font-heading)] font-extrabold text-white mb-4 leading-[1.2] tracking-tight">
              Secure Account <br /> Recovery
            </h2>
            <p className="text-[15px] text-[var(--color-neutral-300)] leading-relaxed max-w-[320px]">
              Don't worry, it happens to the best of us. We'll help you securely reset your password and get back to managing your health.
            </p>
            
            <div className="mt-12 flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <ShieldCheck size={20} weight="fill" className="text-[var(--color-status-success)]" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Secure SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success State */}
        <div className="w-full lg:w-[55%] p-8 md:p-14 flex flex-col justify-center">
          
          {submitted ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500 max-w-[360px] mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-status-success)]/10 to-[var(--color-status-success)]/20 flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--color-status-success)]/30">
                <Envelope size={40} className="text-[var(--color-status-success)]" weight="fill" />
              </div>
              <h1 className="text-[28px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-3 tracking-tight">
                Check Your Email
              </h1>
              <p className="text-[15px] text-[var(--color-neutral-600)] mb-8 leading-relaxed">
                We've sent a secure password reset link to <br/>
                <span className="font-semibold text-[var(--color-brand-primary)] block mt-1">{email}</span>
              </p>
              <Button
                variant="secondary"
                className="w-full h-[48px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all group border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] bg-white text-[14px]"
                onClick={() => {
                  openSignInModal({ redirect: "/" });
                  router.push("/");
                }}
              >
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Sign In
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-[30px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-2 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-[14px] text-[var(--color-neutral-500)] leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  leftIcon={<Envelope size={18} />}
                  required
                />

                <Button type="submit" className="w-full h-[48px] text-[14px] font-bold mt-2 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white transition-all shadow-[0_4px_12px_rgba(11,110,114,0.15)] hover:shadow-[0_6px_16px_rgba(11,110,114,0.25)] flex justify-center items-center group border-none">
                  Send Reset Link
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <div className="mt-10 pt-6 border-t border-[var(--color-neutral-200)] text-center md:text-left">
                <button
                  type="button"
                  onClick={() => {
                    openSignInModal({ redirect: "/" });
                    router.push("/");
                  }}
                  className="text-[14px] text-[var(--color-neutral-500)] font-semibold hover:text-[var(--color-brand-primary)] transition-colors inline-flex items-center group"
                >
                  <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
