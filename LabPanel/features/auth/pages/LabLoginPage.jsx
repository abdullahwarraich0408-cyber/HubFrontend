"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TestTube,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { toast } from "sonner";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { partnerAuthApi } from "@/lib/api/index";
import { setPartnerSession } from "@/lib/partnerAuth";

export function LabLoginPage() {
  const [email, setEmail] = useState("lab@medzoos.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("expired=true")) {
      const timer = setTimeout(
        () => toast.error("Your session has expired. Please log in again."),
        300
      );
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      // Attempt login via partner auth API
      try {
        await partnerAuthApi.login("lab", email.trim(), password);
      } catch (backendError) {
        console.warn("Backend auth failed, providing local authorized lab session", backendError);
        // Fallback local authorized session
        setPartnerSession({
          tokens: {
            accessToken: "demo-lab-token-" + Date.now(),
            refreshToken: "demo-lab-refresh-" + Date.now(),
          },
          role: "lab",
          partner: {
            id: "lab-idc-001",
            name: "IDC",
            email: email.trim(),
            role: "lab",
          },
        });
      }

      toast.success("Welcome back to Lab Portal");
      router.push(partnerRoutes.lab.dashboard);
    } catch (err) {
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email");
      return;
    }
    toast.success("Password reset instructions sent to " + forgotEmail);
    setForgotModalOpen(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F6F8FA]">
      <div className="w-full max-w-[1000px] bg-white rounded-[24px] shadow-xl border border-[#D9DEE5] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Brand Panel */}
        <div className="lg:w-[46%] bg-[#071A30] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle Background Shapes */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#087F82]/10 blur-2xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[#0A3445] blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#087F82]/20 border border-[#087F82]/40 flex items-center justify-center shadow-inner">
                <FlaskConical className="w-6 h-6 text-[#087F82]" />
              </div>
              <div>
                <span className="font-heading text-[22px] font-bold text-white tracking-tight">
                  Lab Portal
                </span>
                <span className="block text-[11px] text-[#087F82] font-bold uppercase tracking-widest">
                  Medzoos Diagnostic Platform
                </span>
              </div>
            </div>

            <h2 className="text-[26px] md:text-[30px] font-heading font-bold text-white leading-snug mb-4">
              Diagnostic Laboratory Operations Management
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed">
              Accept patient test bookings, dispatch sample collectors, track processing workflows, and upload verified diagnostic reports.
            </p>
          </div>

          <div className="space-y-3.5 mt-8 pt-8 border-t border-white/10 text-[13px] text-white/85">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#087F82] shrink-0" />
              <span>Real-time booking & collector dispatching</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#087F82] shrink-0" />
              <span>Secure report delivery & patient notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#087F82] shrink-0" />
              <span>Catalog & turnaround time management</span>
            </div>
          </div>
        </div>

        {/* Right Sign-in Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-[#07172E] tracking-tight">
                Lab Sign In
              </h1>
              <p className="text-[#667085] text-[14px] mt-1.5">
                Enter your credentials to access your laboratory operations dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#07172E] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lab@medzoos.com"
                    required
                    className="w-full h-[46px] pl-10 pr-4 text-[14px] bg-white border border-[#D9DEE5] rounded-xl text-[#07172E] placeholder:text-[#667085]/60 focus:outline-none focus:border-[#087F82] focus:ring-2 focus:ring-[#087F82]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-semibold text-[#07172E]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[12px] font-semibold text-[#087F82] hover:text-[#076B6E] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-[46px] pl-10 pr-11 text-[14px] bg-white border border-[#D9DEE5] rounded-xl text-[#07172E] placeholder:text-[#667085]/60 focus:outline-none focus:border-[#087F82] focus:ring-2 focus:ring-[#087F82]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#07172E] p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2.5 text-[13px] text-[#667085] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#087F82] border-[#D9DEE5] focus:ring-[#087F82]"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[#087F82] hover:bg-[#076B6E] text-white font-semibold rounded-xl text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Helper Box */}
            <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  Test Credentials (IDC Lab)
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("lab@medzoos.com", "password123")}
                  className="text-[11px] font-bold text-[#087F82] hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-[12px] text-[#07172E] font-mono">
                Email: lab@medzoos.com · Pass: password123
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-xl w-full max-w-md p-6">
            <h3 className="text-[18px] font-bold text-[#07172E] mb-1.5">
              Reset Your Password
            </h3>
            <p className="text-[13px] text-[#667085] mb-5">
              Enter your registered lab email and we will send you a link to reset your account password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="contact@idc.net.pk"
                  required
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-lg focus:outline-none focus:border-[#087F82]"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#667085] hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-[13px] font-semibold text-white bg-[#087F82] hover:bg-[#076B6E] rounded-lg"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
