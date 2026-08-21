"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, Lock } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { AuthButton } from "./AuthButton";
import { AuthError } from "./AuthError";
import { AuthPageHeader } from "./AuthChrome";

export function EmailLoginForm({ onSuccess }) {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const user = await loginWithEmail(email.trim(), password);
      onSuccess?.(user);
    } catch (err) {
      setFormError(
        friendlyAuthError(err, "We couldn't sign you in. Check your details and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthPageHeader
        title="Welcome back"
        description="Please enter your details."
      />
      <AuthError
        message={formError}
        onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
      />
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          leftIcon={<Envelope size={18} />}
          error={fieldErrors.email}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          leftIcon={<Lock size={18} />}
          error={fieldErrors.password}
        />
        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-[13px] font-semibold text-[#17618E] hover:underline">
            Forgot password?
          </Link>
        </div>
        <AuthButton loading={loading} loadingLabel="Signing in..." showArrow={false}>
          Sign in
        </AuthButton>
      </form>
    </div>
  );
}
