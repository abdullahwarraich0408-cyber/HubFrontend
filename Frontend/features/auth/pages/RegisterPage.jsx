"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Envelope, Lock, User } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { AuthPageHeader } from "@/features/auth/components/AuthChrome";

export function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { registerWithEmail } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
    if (!form.email.trim()) nextErrors.email = "Please enter your email address.";
    if (!form.password) nextErrors.password = "Please create a password.";
    else if (form.password.length < 8) nextErrors.password = "Your password must be at least 8 characters.";
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
      <AuthPageHeader
        title="Create your account"
        description="Join Medzoos with your email to access medicines, doctors and lab tests."
      />

      <AuthError
        message={formError}
        onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
      />

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
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
            label="Password"
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

        <label className="flex items-start gap-3 text-[13px] leading-5 text-[#5B6B7A]">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D7E4EA] text-[#17618E] focus:ring-[#17618E]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#17618E] hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#17618E] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {fieldErrors.terms ? (
          <p className="-mt-2 text-[13px] text-[#D92D20]">{fieldErrors.terms}</p>
        ) : null}

        <AuthButton loading={loading} loadingLabel="Creating account..." showArrow={false}>
          Create account
        </AuthButton>
      </form>

      <p className="mt-4 text-[14px] text-[#5B6B7A]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#17618E] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
