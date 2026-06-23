"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-[var(--color-brand-primary)]/20 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-dark)] shadow-[var(--shadow-card)]",
      secondary:
        "bg-transparent text-[var(--color-brand-primary)] border-[1.5px] border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)]",
      danger: "bg-[var(--color-status-danger)] text-white hover:brightness-95",
      ghost: "bg-transparent text-[var(--color-neutral-600)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-neutral-100)]",
      icon: "bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)] p-0 rounded-[var(--radius-md)]",
    };

    const sizes = {
      sm: "h-[36px] px-[14px] text-[13px] rounded-[var(--radius-md)]",
      md: "h-[44px] px-[20px] text-[14px] rounded-[var(--radius-md)]",
      lg: "h-[52px] px-[28px] text-[15px] rounded-[var(--radius-lg)]",
      icon: "h-[40px] w-[40px] rounded-[var(--radius-md)]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant === "icon" ? sizes.icon : sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex space-x-1.5 items-center">
            <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
          </div>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
