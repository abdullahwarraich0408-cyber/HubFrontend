"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { needsProfileCompletion } from "@/lib/auth/needsProfileCompletion";
import { friendlyAuthError } from "@/lib/auth/friendlyAuthError";
import { CompleteProfileForm } from "./CompleteProfileForm";
import { EmailLoginForm } from "./EmailLoginForm";
import { SocialLogin } from "./SocialLogin";
import { AuthDivider } from "./AuthChrome";

export function AuthFlow({ onAuthenticated }) {
  const { updateProfile, user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(() =>
    isAuthenticated && needsProfileCompletion(user) ? "profile" : "email"
  );
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated && needsProfileCompletion(user)) {
      setStep("profile");
    }
  }, [isAuthenticated, user]);

  const finish = (sessionUser) => {
    if (needsProfileCompletion(sessionUser)) {
      setStep("profile");
      return;
    }
    onAuthenticated?.(sessionUser);
  };

  const saveProfile = async (payload) => {
    setError("");
    setSavingProfile(true);
    try {
      const nextUser = await updateProfile(payload);
      onAuthenticated?.(nextUser);
    } catch (err) {
      setError(friendlyAuthError(err, "We couldn't save your details. Please try again."));
    } finally {
      setSavingProfile(false);
    }
  };

  if (step === "profile") {
    return <CompleteProfileForm loading={savingProfile} error={error} onSubmit={saveProfile} />;
  }

  return (
    <div>
      <EmailLoginForm onSuccess={finish} />
      <AuthDivider label="or" />
      <SocialLogin onSuccess={finish} />
      <p className="mt-5 text-[14px] text-[#6B7C7B]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#087F8C] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
