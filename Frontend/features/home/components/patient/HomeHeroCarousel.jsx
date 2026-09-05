"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  UploadSimple,
  Stethoscope,
  Pill,
  Flask,
  House,
} from "@phosphor-icons/react";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { publicHomeSlidesApi } from "@/lib/api/index";
import { useAuth } from "@/lib/auth/AuthProvider";

import { usePrescriptionModal } from "@/features/prescription/context/PrescriptionModalContext";

const AUTOPLAY_MS = 2500;

const ACTION_HREF = {
  prescription: "/prescriptions/upload",
  doctors: "/doctors",
  pharmacy: "/vendors",
  labs: "/lab-tests",
  hospitals: "/hospitals",
};

const ACTION_ICON = {
  prescription: UploadSimple,
  doctors: Stethoscope,
  pharmacy: Pill,
  labs: Flask,
  hospitals: House,
};

export const HERO_SLIDES = [
  {
    id: "prescription",
    label: "Easy Medicine Ordering",
    title: "Upload your prescription and find your medicines",
    description:
      "Have a prescription? Upload it securely and continue your medicine order through pharmacies available on Medzoos.",
    note: "Prescription medicines require a valid prescription where applicable.",
    cta: "Upload Prescription",
    href: "/prescriptions/upload",
    ctaIcon: UploadSimple,
    image: "/images/hero-upload-prescription.png",
    alt: "Patient uploading a prescription through Medzoos",
    bg: "bg-[#EAF6FA]",
    blob: "bg-[#0B6E99]/10",
  },
  {
    id: "consult",
    label: "Doctor Consultations",
    title: "Consult a doctor from wherever you are",
    description:
      "Explore healthcare professionals and book an online or in-clinic consultation according to your needs.",
    cta: "Find a Doctor",
    href: "/doctors",
    secondaryCta: "My Appointments",
    secondaryHref: "/account/appointments",
    ctaIcon: Stethoscope,
    image: "/images/hero-consult-doctor.png",
    alt: "Doctor consulting with a patient",
    bg: "bg-[#E9F8F5]",
    blob: "bg-[#16A085]/12",
  },
  {
    id: "medicines",
    label: "Online Pharmacy",
    title: "Find and order the medicines you need",
    description:
      "Search medicines and healthcare products from pharmacies available through Medzoos.",
    note: "Upload a prescription where required.",
    cta: "Shop Medicines",
    href: "/vendors",
    ctaIcon: Pill,
    image: "/images/hero-buy-medicine.png",
    alt: "Pharmacist helping a patient with medicines",
    bg: "bg-[#EEF5FC]",
    blob: "bg-[#16A9E0]/12",
  },
  {
    id: "labs",
    label: "Diagnostic Services",
    title: "Book your lab tests with ease",
    description:
      "Find diagnostic tests, choose participating laboratories and request home sample collection where available.",
    cta: "Book a Lab Test",
    href: "/lab-tests",
    secondaryCta: "View Lab Bookings",
    secondaryHref: "/orders?type=lab",
    ctaIcon: Flask,
    badge: "Home Sampling Available at Selected Labs",
    image: "/images/hero-lab-test.png",
    alt: "Laboratory professional preparing a diagnostic test",
    bg: "bg-[#EDF8F7]",
    blob: "bg-[#0B6E99]/10",
  },
];

function HeroImage({ src, alt, priority }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/70 via-[#EAF7F5] to-[#DEEEF9]"
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 52vw"
      className="object-cover object-center"
      onError={() => setFailed(true)}
    />
  );
}

function NavArrow({ direction, onClick, label }) {
  const Icon = direction === "prev" ? CaretLeft : CaretRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-[#102A43]/08 bg-white text-[#0B6E99]",
        "shadow-[0_2px_10px_rgba(16,42,67,0.1)] transition-all duration-200",
        "hover:border-[#0B6E99]/25 hover:bg-[#F1F7FA] hover:text-[#073B4C]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/35 focus-visible:ring-offset-2",
        "active:scale-[0.96]"
      )}
    >
      <Icon size={16} weight="bold" />
    </button>
  );
}

function isDarkColor(colorStr) {
  if (!colorStr) return false;
  const hexMatch = colorStr.match(/#([0-9a-fA-F]{6})/);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma < 170;
  }
  return false;
}

export function HomeHeroCarousel() {
  const { openPrescriptionModal } = usePrescriptionModal();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);
  const rootRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const audience = isAuthenticated ? "returning" : "first_visit";
  const { data } = useQuery({
    queryKey: ["home-slides", audience],
    queryFn: () => publicHomeSlidesApi.list(audience),
    staleTime: 5 * 60 * 1000,
  });

  const slides =
    data?.slides?.length > 0
      ? data.slides.map((item, i) => {
          const actionMap = {
            prescription: "prescription",
            doctors: "consult",
            pharmacy: "medicines",
            labs: "labs",
            hospitals: "consult",
          };
          const action = item.action || "doctors";
          const fallbackId = actionMap[action] || "consult";
          const fallback =
            HERO_SLIDES.find((s) => s.id === fallbackId) ||
            HERO_SLIDES[i] ||
            HERO_SLIDES[0];

          let href = item.href;
          if (!href) {
            if (
              action === "doctors" ||
              (item.cta && item.cta.toLowerCase().includes("doctor")) ||
              (item.title && item.title.toLowerCase().includes("doctor"))
            ) {
              href = "/doctors";
            } else if (
              action === "hospitals" ||
              (item.cta && item.cta.toLowerCase().includes("hospital"))
            ) {
              href = "/hospitals";
            } else if (ACTION_HREF[action]) {
              href = ACTION_HREF[action];
            } else {
              href = fallback.href;
            }
          }

          return {
            ...fallback,
            id: item.id,
            title: item.title || fallback.title,
            description: item.description || fallback.description,
            cta: item.cta || fallback.cta,
            href,
            ctaIcon: ACTION_ICON[action] || fallback.ctaIcon,
            image: item.image_url || fallback.image,
            badge: item.badge || fallback.badge,
            bgColor: item.bg || null,
          };
        })
      : HERO_SLIDES;

  const slideCount = slides.length;

  const goTo = useCallback(
    (next, dir = 1) => {
      setDirection(dir);
      setIndex(((next % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, slideCount]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPaused(true);
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPaused(true);
        prev();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = slides[index] || HERO_SLIDES[0];
  const CtaIcon = slide.ctaIcon;
  const isDark = isDarkColor(slide.bgColor || slide.bg);

  const variants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
      };

  return (
    <section
      ref={rootRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Healthcare actions"
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/35 focus-visible:ring-offset-2 rounded-[28px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        setPaused(true);
        if (delta < 0) next();
        else prev();
      }}
    >
      {/* Fixed frame so every slide matches prescription banner size */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[24px] shadow-[0_12px_40px_rgba(16,42,67,0.08)] md:rounded-[28px]",
          "min-h-[500px] sm:min-h-[480px] md:min-h-0 md:h-[420px] lg:h-[440px]",
          slide.bg
        )}
        style={slide.bgColor ? { backgroundColor: slide.bgColor } : undefined}
      >
        <div
          className={cn(
            "pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full blur-3xl",
            slide.blob
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/50 blur-3xl"
          aria-hidden
        />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 grid h-full w-full md:grid-cols-[48%_52%]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slideCount}: ${slide.title}`}
          >
            {/* Text column — fixed height, consistent padding */}
            <div className="relative z-10 flex h-full flex-col justify-start px-5 pt-5 pb-[210px] sm:px-7 sm:pb-[220px] md:justify-center md:px-8 md:py-8 lg:px-10">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.06 }}
                className="flex flex-col"
              >
                <p className={cn(
                  "text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.12em] md:text-[13px]",
                  isDark ? "text-[#7DD3C7] drop-shadow-sm" : "text-[#0B6E99]"
                )}>
                  {slide.label}
                </p>
                <h2 className={cn(
                  "mt-1.5 line-clamp-3 max-w-[22ch] text-[clamp(1.4rem,4.5vw,2.4rem)] sm:text-[clamp(1.65rem,2.8vw,2.5rem)] font-extrabold leading-[1.15] tracking-tight",
                  isDark ? "text-white drop-shadow-sm" : "text-[#073B4C]"
                )}>
                  {slide.title}
                </h2>
                <p className={cn(
                  "mt-2.5 line-clamp-3 max-w-[32rem] text-[14px] sm:text-[15px] leading-[1.55] md:text-[16px]",
                  isDark ? "text-white/95 font-medium" : "text-[#334155]"
                )}>
                  {slide.description}
                </p>

                {/* Reserved slot so badge/note don't change layout height */}
                <div className="mt-2.5 min-h-[26px]">
                  {slide.badge ? (
                    <span className={cn(
                      "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold",
                      isDark
                        ? "border-white/25 bg-white/20 text-white backdrop-blur-sm"
                        : "border-[#0B6E99]/15 bg-white/80 text-[#0B6E99]"
                    )}>
                      <House size={13} weight="duotone" />
                      {slide.badge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 sm:mt-4 flex min-h-[44px] flex-col gap-2 sm:flex-row sm:items-center">
                  {slide.id === "prescription" || slide.cta === "Upload Prescription" ? (
                    <button
                      type="button"
                      onClick={() => openPrescriptionModal()}
                      className={cn(
                        "group inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-[14px] px-4 sm:px-5 text-[13px] sm:text-[14px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/40 focus-visible:ring-offset-2 sm:w-auto shadow-md",
                        isDark
                          ? "bg-white text-[#073B4C] hover:bg-slate-100"
                          : "bg-[#0B6E99] text-white hover:bg-[#073B4C]"
                      )}
                    >
                      <CtaIcon size={16} weight="bold" />
                      {slide.cta}
                      <ArrowRight
                        size={15}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-[3px]"
                      />
                    </button>
                  ) : (
                    <Link
                      href={slide.href}
                      className={cn(
                        "group inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-[14px] px-4 sm:px-5 text-[13px] sm:text-[14px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/40 focus-visible:ring-offset-2 sm:w-auto shadow-md",
                        isDark
                          ? "bg-white text-[#073B4C] hover:bg-slate-100"
                          : "bg-[#0B6E99] text-white hover:bg-[#073B4C]"
                      )}
                    >
                      <CtaIcon size={16} weight="bold" />
                      {slide.cta}
                      <ArrowRight
                        size={15}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-[3px]"
                      />
                    </Link>
                  )}
                  {slide.secondaryCta && slide.secondaryHref ? (
                    <Link
                      href={slide.secondaryHref}
                      className={cn(
                        "inline-flex h-11 sm:h-12 w-full items-center justify-center rounded-[14px] border px-4 text-[13px] font-bold transition-colors sm:w-auto",
                        isDark
                          ? "border-white/35 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                          : "border-[#102A43]/12 bg-white/80 text-[#102A43] hover:bg-white"
                      )}
                    >
                      {slide.secondaryCta}
                    </Link>
                  ) : (
                    <span className="hidden h-12 sm:block sm:w-[1px]" aria-hidden />
                  )}
                </div>

                <div className="mt-2 min-h-[28px]">
                  {slide.note ? (
                    <p className={cn(
                      "max-w-md text-[11px] sm:text-[12px] leading-relaxed",
                      isDark ? "text-white/85 font-medium" : "text-[#627D98]"
                    )}>
                      {slide.note}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            </div>

            {/* Image column — same size on every slide */}
            <div className="relative hidden h-full md:block">
              <div className="absolute inset-4 overflow-hidden rounded-[22px] lg:inset-5">
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { scale: 1.03, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
                >
                  <HeroImage
                    src={slide.image}
                    alt={slide.alt}
                    priority={index === 0}
                  />
                </motion.div>
              </div>
            </div>

            {/* Mobile image — responsive height banner card */}
            <div className="absolute inset-x-4 bottom-[48px] h-[155px] sm:h-[175px] overflow-hidden rounded-[18px] md:hidden shadow-sm border border-white/20">
              <HeroImage
                src={slide.image}
                alt={slide.alt}
                priority={index === 0}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls: arrows + dots together at bottom — cleaner than edge-spanning arrows */}
        <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3 md:bottom-4">
          <NavArrow
            direction="prev"
            label="Previous slide"
            onClick={() => {
              setPaused(true);
              prev();
            }}
          />

          <div className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 backdrop-blur-sm">
            {slides.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${item.title}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setPaused(true);
                    goTo(i, i > index ? 1 : -1);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/40",
                    active
                      ? "w-6 bg-[#0B6E99]"
                      : "w-2 bg-[#102A43]/20 hover:bg-[#102A43]/35"
                  )}
                />
              );
            })}
          </div>

          <NavArrow
            direction="next"
            label="Next slide"
            onClick={() => {
              setPaused(true);
              next();
            }}
          />
        </div>
      </div>
    </section>
  );
}
