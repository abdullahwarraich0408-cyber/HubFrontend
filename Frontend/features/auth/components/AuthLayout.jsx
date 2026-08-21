"use client";

import { AuthVisualPanel } from "./AuthVisualPanel";
import { AuthFooter } from "./AuthFooter";
import { AuthBrandMark } from "./AuthChrome";

export function AuthLayout({ children, variant = "default" }) {
  return (
    <div className="h-dvh overflow-hidden bg-[#E7F1F0] lg:flex lg:items-center lg:justify-center lg:p-4">
      <div className="flex h-full w-full max-w-[1080px] overflow-hidden bg-white lg:h-[min(720px,calc(100dvh-2rem))] lg:rounded-[28px] lg:shadow-[0_24px_80px_rgba(8,63,70,0.14)]">
        <AuthVisualPanel variant={variant} />

        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white lg:w-[58%] xl:w-[56%]">
          <div className="relative shrink-0 lg:hidden">
            <div className="relative h-[110px] overflow-hidden bg-gradient-to-br from-[#0FA7E3] via-[#17618E] to-[#082B3F]">
              <picture>
                <source srcSet="/images/auth-medzoos-healthcare.webp" type="image/webp" />
                <img
                  src="/images/auth-medzoos-healthcare.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-70"
                />
              </picture>
              <div className="absolute inset-0 bg-[#17618E]/35" />
              <div className="relative z-10 flex h-full items-center px-5">
                <AuthBrandMark light />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-width:none] sm:px-8 sm:py-6 lg:px-10 lg:py-6 [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto w-full max-w-[400px]">{children}</div>
          </div>

          <div className="shrink-0">
            <AuthFooter />
          </div>
        </section>
      </div>
    </div>
  );
}
