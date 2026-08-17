"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Envelope, Lock, Phone, ShieldCheck, User } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { normalizePhoneNumber } from "@/lib/auth/phoneUtils";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";

export function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { registerWithEmail } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your mobile number.";
    } else {
      const formatted = normalizePhoneNumber(form.phone);
      if (!formatted.startsWith("+") || formatted.length < 11) {
        nextErrors.phone = "Enter a valid Pakistan mobile number, such as 03XX XXXXXXX.";
      }
    }
    if (!form.email.trim()) nextErrors.email = "Please enter your email address.";
    if (!form.password) nextErrors.password = "Please create a password.";
    else if (form.password.length < 8) nextErrors.password = "Your password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!agreeTerms) nextErrors.terms = "Please agree to the Terms & Conditions and Privacy Policy.";

    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await registerWithEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: normalizePhoneNumber(form.phone),
      });
      await completeWebLogin({ router, redirectTo });
    } catch (err) {
      setFormError(friendlyAuthError(err, "We couldn't create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
        Create your Medzoos account
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
        Join Medzoos to access healthcare services more conveniently.
      </p>

      <AuthError
        message={formError}
        onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
      />

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <AuthInput
          label="Full name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          placeholder="Enter your full name"
          leftIcon={<User size={18} />}
          error={fieldErrors.name}
        />
        <AuthInput
          label="Mobile number"
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update("phone")}
          placeholder="03XX XXXXXXX"
          leftIcon={<Phone size={18} />}
          error={fieldErrors.phone}
        />
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          placeholder="Enter your email"
          leftIcon={<Envelope size={18} />}
          error={fieldErrors.email}
        />
        <div>
          <PasswordInput
            label="Create password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            placeholder="Create a strong password"
            leftIcon={<Lock size={18} />}
            error={fieldErrors.password}
          />
          <PasswordRequirements password={form.password} />
        </div>
        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          placeholder="Enter your password again"
          leftIcon={<Lock size={18} />}
          error={fieldErrors.confirmPassword}
        />

        <label className="flex items-start gap-3 text-[13px] leading-5 text-[#627D98]">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D9E5EC] text-[#17618E] focus:ring-[#16A9E0]"
          />
          <span>
            By creating an account, you agree to the Medzoos{" "}
            <Link href="/terms" className="font-semibold text-[#17618E] hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#17618E] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {fieldErrors.terms ? (
          <p className="-mt-3 text-[13px] text-[#D92D20]">{fieldErrors.terms}</p>
        ) : null}

        <div className="flex items-start gap-2 rounded-[14px] bg-[#F1F7FA] px-3.5 py-3 text-[13px] leading-5 text-[#415F78]">
          <ShieldCheck size={16} weight="fill" className="mt-0.5 shrink-0 text-[#17618E]" />
          <p>Your account helps keep your healthcare activity in one secure place.</p>
        </div>

        <AuthButton loading={loading} loadingLabel="Creating account...">
          Create Account
        </AuthButton>
      </form>

      <p className="mt-6 text-[15px] text-[#627D98]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#17618E] hover:underline">
          Sign in
        </Link>
      </p>

      <div className="mt-8 border-t border-[#D9E5EC] pt-5">
        <p className="text-[14px] text-[#627D98]">Are you a healthcare provider?</p>
        <Link href="/provider/register" className="mt-1 inline-block text-[14px] font-semibold text-[#17618E] hover:underline">
          Join Medzoos as a Provider
        </Link>
      </div>
    </AuthLayout>
  );
}
