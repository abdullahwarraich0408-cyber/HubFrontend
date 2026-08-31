"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api/index";
import { toast } from "sonner";

export default function LabResetPasswordRoute() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F6F8FA]">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-xl border border-[#D9DEE5] p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#DEEEF9] text-[#17618E] flex items-center justify-center mx-auto mb-4 font-bold">
            <KeyRound size={24} />
          </div>
          <h1 className="text-[24px] font-bold text-[#082B3F] tracking-tight">
            {success ? "Password Reset Complete" : "Set New Password"}
          </h1>
          <p className="text-[#667085] text-[13px] mt-1.5">
            {success
              ? "Your password has been successfully updated. You can now log in to the Lab Portal."
              : "Enter a strong new password for your lab portal account."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium leading-relaxed">
            {error}
          </div>
        )}

        {success ? (
          <button
            type="button"
            onClick={() => router.push("/lab/login")}
            className="w-full h-[48px] bg-[#17618E] hover:bg-[#124362] text-white font-semibold rounded-xl text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Proceed to Lab Login</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#082B3F] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full h-[44px] pl-10 pr-11 text-[14px] bg-white border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E] focus:ring-2 focus:ring-[#17618E]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#082B3F] p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#082B3F] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full h-[44px] pl-10 pr-11 text-[14px] bg-white border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E] focus:ring-2 focus:ring-[#17618E]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-[#17618E] hover:bg-[#124362] text-white font-semibold rounded-xl text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Updating password..." : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/lab/login"
                className="text-[13px] font-semibold text-[#17618E] hover:underline"
              >
                Back to Lab Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
