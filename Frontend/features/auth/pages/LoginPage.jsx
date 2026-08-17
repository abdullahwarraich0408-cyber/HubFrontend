"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Envelope, Lock } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { isFirebaseConfigured } from "@/lib/firebase";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { loginWithEmail, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectTo || "/");
    }
  }, [authLoading, isAuthenticated, redirectTo, router]);

  const finishLogin = () => completeWebLogin({ router, redirectTo });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Please enter your email address.";
    if (!password) nextErrors.password = "Please enter your password.";
    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      await finishLogin();
    } catch (err) {
      setFormError(
        friendlyAuthError(err, "We couldn't sign you in. Check your details and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
        Welcome back
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
        Sign in to continue managing your healthcare with Medzoos.
      </p>

      <AuthError
        message={formError}
        onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
      />

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          leftIcon={<Envelope size={18} />}
          error={fieldErrors.email}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          leftIcon={<Lock size={18} />}
          error={fieldErrors.password}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-[14px] font-semibold text-[#17618E] hover:underline">
            Forgot password?
          </Link>
        </div>
        <AuthButton loading={loading} loadingLabel="Signing in...">
          Sign In
        </AuthButton>
      </form>

      {isFirebaseConfigured() ? (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3 text-[12px] font-medium uppercase tracking-wider text-[#8AA0B2]">
            <span className="h-px flex-1 bg-[#D9E5EC]" />
            Or
            <span className="h-px flex-1 bg-[#D9E5EC]" />
          </div>
          <GoogleLoginButton onSuccess={finishLogin} />
        </div>
      ) : null}

      <p className="mt-6 text-[15px] text-[#627D98]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#17618E] hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
