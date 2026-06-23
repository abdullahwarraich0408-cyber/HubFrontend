"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";

export const Input = forwardRef(
  (
    {
      className,
      label,
      error,
      success,
      disabled,
      type = "text",
      leftIcon,
      rightIcon,
      id,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseStyles =
      "w-full h-[44px] px-[16px] bg-[var(--color-neutral-100)] border-[1.5px] border-[var(--color-neutral-300)] rounded-[var(--radius-md)] text-[var(--color-neutral-900)] text-[14px] font-sans transition-all duration-200 outline-none placeholder:text-[var(--color-neutral-500)] shadow-sm";
    
    const focusStyles = "focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/10";
    const errorStyles = "border-[var(--color-status-danger)] focus:border-[var(--color-status-danger)] focus:ring-[var(--color-status-danger)]/10";
    const successStyles = "border-[var(--color-status-success)] focus:border-[var(--color-status-success)]";
    const disabledStyles = "disabled:opacity-60 disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed";

    return (
      <div className={cn("w-full flex flex-col", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-[var(--color-ink-900)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-[14px] text-[var(--color-neutral-500)] pointer-events-none z-10">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            placeholder={placeholder || (label ? `Enter your ${label.toLowerCase()}` : "")}
            className={cn(
              baseStyles,
              focusStyles,
              disabledStyles,
              error && errorStyles,
              success && !error && successStyles,
              leftIcon && "pl-[40px]",
              (rightIcon || type === "password" || success) && "pr-[40px]"
            )}
            {...props}
          />
          
          {/* Right side icons logic */}
          <div className="absolute right-[14px] flex items-center text-[var(--color-neutral-500)] z-10">
            {type === "password" ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-[var(--color-neutral-900)] focus:outline-none p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            ) : success && !error ? (
              <CheckCircle size={18} weight="fill" className="text-[var(--color-status-success)]" />
            ) : (
              rightIcon
            )}
          </div>
        </div>
        {error && <span className="text-[13px] text-[var(--color-status-danger)] mt-1.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
