"use client";

import { useState } from "react";
import { Phone, GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { normalizePhoneNumber } from "@/lib/auth/phoneUtils";
import {
  DEV_TEST_OTP,
  DEV_TEST_PHONE,
  formatFirebaseAuthError,
  isTestAuthEnabled,
} from "@/lib/auth/firebaseErrors";

const showTestAuth = isTestAuthEnabled();

export function OtpModal({ open, onClose, onSuccess, phone: initialPhone = "" }) {
  const { startPhoneLogin, completePhoneLogin } = useAuth();
  const [step, setStep] = useState(initialPhone ? "otp" : "phone");
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formatted = normalizePhoneNumber(phone);
      if (!formatted.startsWith("+") || formatted.length < 11) {
        throw new Error("Enter a valid phone number with country code (e.g. +92 336 1400373).");
      }
      const result = await startPhoneLogin(formatted);
      setConfirmation(result);
      setStep("otp");
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await completePhoneLogin(confirmation, code.trim());
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const useDevTestNumber = () => {
    setPhone(DEV_TEST_PHONE);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-[var(--color-ink-headline)]">
          {step === "phone" ? "Sign in with Phone" : "Enter OTP"}
        </h2>
        <p className="text-sm text-[var(--color-neutral-500)] mt-1 mb-4">
          {step === "phone"
            ? "Primary sign-in method. No password required."
            : `Code sent to ${phone}`}
        </p>

        {error ? (
          <pre className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3 whitespace-pre-wrap font-sans">
            {error}
          </pre>
        ) : null}

        {showTestAuth && step === "phone" ? (
          <div className="text-xs text-[var(--color-neutral-600)] bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-lg px-3 py-2 mb-3 space-y-2">
            <p className="font-semibold text-[var(--color-ink-headline)]">Test login (no SMS)</p>
            <p>
              Dev login (no Firebase SMS): use{" "}
              <code className="text-[11px]">{DEV_TEST_PHONE}</code> → OTP{" "}
              <code className="text-[11px]">{DEV_TEST_OTP}</code>
            </p>
            <button
              type="button"
              onClick={useDevTestNumber}
              className="text-[var(--color-brand-primary)] font-semibold underline"
            >
              Fill test number
            </button>
          </div>
        ) : null}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <label className="block text-sm font-medium">Phone number</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <Phone size={18} className="text-[var(--color-neutral-400)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0336 1400373 or +92 336 1400373"
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[var(--color-brand-primary)] text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-sm font-medium">One-time password</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              className="w-full border rounded-xl px-3 py-2 text-center tracking-widest"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[var(--color-brand-primary)] text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
            <button type="button" className="text-sm text-[var(--color-brand-primary)]" onClick={() => setStep("phone")}>
              Change phone number
            </button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t">
          <GoogleLoginButton
            onSuccess={() => {
              onSuccess?.();
              onClose?.();
            }}
          />
        </div>

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
