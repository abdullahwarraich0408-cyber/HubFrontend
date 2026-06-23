"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKey, Envelope, ShieldCheck, ArrowRight } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate with backend
      const response = await api.auth.login(email, password);
      
      // 2. Check if the logged-in user actually has admin privileges
      // Depending on your API, the role might be in response.data.user.role
      if (response?.user?.role !== 'admin' && response?.data?.user?.role !== 'admin') {
        // If not an admin, we log them out and reject access
        await api.auth.logout();
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      toast.success("Admin access granted. Welcome to the portal.");
      
      // 3. Redirect to the admin dashboard (HARD RELOAD to clear React Query cache)
      window.location.href = "/admin";
      
    } catch (err) {
      toast.error(err.message || "Authentication failed. Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C1A2E] font-[var(--font-plus-jakarta-sans)] p-4 relative overflow-hidden">
      
      {/* Abstract Background for Admin Portal */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0B6E72]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0C1A2E]/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-[#F6F8FA] p-8 pb-6 border-b border-[#0C1A2E]/10 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#0C1A2E] rounded-xl flex items-center justify-center shadow-lg mb-6 relative">
            <ShieldCheck size={28} weight="fill" className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-xl blur animate-pulse" />
          </div>
          <h1 className="text-2xl font-[var(--font-dm-serif-display)] font-bold text-[#0C1A2E] tracking-tight">
            Restricted Portal
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm mt-2 font-medium">
            Authorized personnel only. Please verify your identity to access the system.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0C1A2E]">Administrator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Envelope size={18} className="text-[#0C1A2E]/40" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pharmahub.com"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-[#F6F8FA] text-[#0C1A2E] text-sm outline-none focus:bg-white focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0C1A2E]">Master Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKey size={18} className="text-[#0C1A2E]/40" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-[#F6F8FA] text-[#0C1A2E] text-sm outline-none focus:bg-white focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] transition-all font-[var(--font-jetbrains-mono)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-[#0C1A2E] hover:bg-[#0C1A2E]/90 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Authenticate Securely
                  <ArrowRight size={18} weight="bold" className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-[#0C1A2E]/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#0C1A2E]/40">
            <ShieldCheck size={14} weight="fill" />
            256-bit Encrypted Connection
          </div>
        </div>

      </div>
    </div>
  );
}
