"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

/**
 * Next/Image wrapper with a polished gradient placeholder when the asset is missing.
 */
export function LandingImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  sizes,
  placeholderTone = "teal",
}) {
  const [failed, setFailed] = useState(false);

  const tone =
    placeholderTone === "mint"
      ? "from-[#D8F3EF] via-[#EAF8F7] to-[#DEEEF9]"
      : placeholderTone === "soft"
        ? "from-[#EAF8F7] via-[#F7FAFC] to-[#E8F0F5]"
        : "from-[#CDEDED] via-[#EAF8F7] to-[#D6EAF5]";

  if (failed || !src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br",
          tone,
          fill ? "absolute inset-0 h-full w-full" : "",
          className
        )}
        style={!fill && width && height ? { width, height } : undefined}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/50 blur-2xl" />
          <div className="absolute -bottom-10 left-6 h-32 w-32 rounded-full bg-[#17618E]/15 blur-2xl" />
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn(className, imageClassName)}
      onError={() => setFailed(true)}
    />
  );
}
