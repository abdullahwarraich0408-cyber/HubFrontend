"use client";

import { useState } from "react";
import { User } from "@phosphor-icons/react";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AuthError } from "./AuthError";
import { AuthPageHeader } from "./AuthChrome";
import { cn } from "@/utils/cn";

const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function CompleteProfileForm({ loading, error, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({
      name: form.name.trim(),
      ...(form.dateOfBirth ? { dateOfBirth: form.dateOfBirth } : {}),
      ...(form.gender ? { gender: form.gender } : {}),
    });
  };

  return (
    <div>
      <AuthPageHeader
        title="A few details to get started"
        description="This helps us personalise your Medzoos care. You can update it later."
      />
      <AuthError message={error} />
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
          label="Date of birth"
          type="date"
          name="dateOfBirth"
          autoComplete="bday"
          value={form.dateOfBirth}
          onChange={update("dateOfBirth")}
        />
        <fieldset>
          <legend className="mb-2 block text-[13px] font-semibold tracking-wide text-[#172525]">
            Gender
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {GENDERS.map((item) => (
              <label
                key={item.value}
                className={cn(
                  "flex min-h-[48px] cursor-pointer items-center justify-center rounded-[14px] border px-3 text-[14px] font-semibold transition-colors",
                  form.gender === item.value
                    ? "border-[#087F8C] bg-[#EAF8F7] text-[#075E5B]"
                    : "border-[#D7E4EA] bg-[#F7FBFC] text-[#172525] hover:border-[#087F8C]/30"
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  value={item.value}
                  checked={form.gender === item.value}
                  onChange={update("gender")}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <AuthButton loading={loading} loadingLabel="Saving..." showArrow={false}>
          Continue
        </AuthButton>
      </form>
    </div>
  );
}
