"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Envelope, Lock, Flask, ShieldCheck, CalendarCheck, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { toast } from "sonner";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { partnerAuthApi } from "@/lib/api/index";

export function LabLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("expired=true")) {
      const timer = setTimeout(() => toast.error("Your session has expired. Please log in again."), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await partnerAuthApi.login("lab", email, password);
      toast.success("Welcome to Lab Portal");
      router.push(partnerRoutes.lab.dashboard);
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-surface-subtle">
      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-lg border border-neutral-200 flex overflow-hidden">
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-brand-primary to-brand-dark p-12 flex-col justify-between text-white">
          <div>
            <Flask size={32} weight="fill" className="mb-6" />
            <h2 className="text-[32px] font-heading font-extrabold mb-4">Lab Partner Portal</h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Manage bookings, upload reports, and grow your diagnostic services on PharmaHub.
            </p>
          </div>
          <div className="space-y-3 text-[13px]">
            <div className="flex items-center gap-2"><CalendarCheck size={18} /> Accept & track bookings</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} /> Secure report delivery</div>
          </div>
        </div>
        <div className="flex-1 p-8 md:p-12">
          <h1 className="text-[24px] font-bold text-ink-headline mb-2">Lab sign in</h1>
          <p className="text-neutral-500 text-[14px] mb-8">Use your lab partner credentials</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[12px] font-semibold text-neutral-600 mb-1.5 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lab@example.com" required />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-neutral-600 mb-1.5 block">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full h-[48px]" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
          <p className="text-[12px] text-neutral-400 mt-6">Demo: lab@pharmahub.com / password123</p>
        </div>
      </div>
    </div>
  );
}
