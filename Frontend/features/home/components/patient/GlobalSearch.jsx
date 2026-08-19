"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  X,
  Pill,
  Stethoscope,
  Flask,
  Storefront,
  ArrowRight,
} from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

const SUGGESTION_CATEGORIES = [
  {
    title: "Medicines & Devices",
    icon: Pill,
    target: "medicines",
    prefix: "Search medicines: ",
    href: (q) => `/browse?q=${encodeURIComponent(q)}`,
  },
  {
    title: "Doctors & Psychologists",
    icon: Stethoscope,
    target: "doctors",
    prefix: "Find doctors for: ",
    href: (q) => `/doctors?q=${encodeURIComponent(q)}`,
  },
  {
    title: "Lab Tests & Health Panels",
    icon: Flask,
    target: "labs",
    prefix: "Book lab tests for: ",
    href: (q) => `/lab-tests/browse?q=${encodeURIComponent(q)}`,
  },
  {
    title: "Pharmacies & Stores",
    icon: Storefront,
    target: "vendors",
    prefix: "Find pharmacies: ",
    href: (q) => `/vendors?q=${encodeURIComponent(q)}`,
  },
];

export function GlobalSearch({
  placeholder = "Search medicines, doctors, psychologists, labs...",
  size = "md",
  className,
  shortcuts = [],
  showShortcuts = false,
}) {
  const router = useRouter();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const submit = (value = query, forcedCategory = null) => {
    const q = String(value || "").trim();
    if (!q) return;
    setFocused(false);

    if (forcedCategory) {
      const match = SUGGESTION_CATEGORIES.find((cat) => cat.target === forcedCategory);
      if (match) {
        router.push(match.href(q));
        return;
      }
    }

    const lower = q.toLowerCase();
    if (/(psycholog|mental|therap|anxiety|depress|stress)/.test(lower)) {
      router.push(`/doctors?specialty=psychologist&q=${encodeURIComponent(q)}`);
      return;
    }
    if (/(lab|hba1c|sugar|test|cbc|thyroid|lipid)/.test(lower)) {
      router.push(`/lab-tests/browse?q=${encodeURIComponent(q)}`);
      return;
    }
    if (/(doctor|consult|clinic)/.test(lower)) {
      router.push(`/doctors?q=${encodeURIComponent(q)}`);
      return;
    }
    if (/(pharmacy|pharmac)/.test(lower)) {
      router.push(`/vendors?q=${encodeURIComponent(q)}`);
      return;
    }
    router.push(`/browse?q=${encodeURIComponent(q)}`);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-full border bg-[#F1F7FA] px-4 transition-all",
          size === "lg" ? "h-14 px-5" : "h-11",
          focused
            ? "border-[#0B6E99] bg-white shadow-[0_0_0_3px_rgba(11,110,153,0.15)]"
            : "border-transparent hover:border-[#0B6E99]/20"
        )}
      >
        <button
          type="button"
          onClick={() => submit()}
          className="shrink-0 text-[#0B6E99] hover:opacity-80 transition-opacity"
          aria-label="Submit search"
        >
          <MagnifyingGlass
            size={size === "lg" ? 20 : 18}
            weight="bold"
          />
        </button>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-[#102A43] outline-none placeholder:text-[#627D98]",
            size === "lg" ? "text-[15px] md:text-[16px]" : "text-[13px] md:text-[14px]"
          )}
          aria-label="Search healthcare services"
        />

        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#102A43]/10 text-[#627D98] transition-colors hover:bg-[#102A43]/20 hover:text-[#102A43]"
            aria-label="Clear query"
          >
            <X size={12} weight="bold" />
          </button>
        ) : null}

        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#0B6E99] px-3.5 py-1.5 text-[12px] md:text-[13px] font-semibold text-white transition-colors hover:bg-[#073B4C]"
        >
          Search
        </button>
      </form>

      {/* Autocomplete / Quick Suggestion Dropdown */}
      {focused ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#102A43]/08 bg-white py-2 shadow-[0_16px_40px_rgba(16,42,67,0.16)]">
          {query.trim() ? (
            <div className="py-1">
              <p className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#627D98]">
                Search options for &quot;{query.trim()}&quot;
              </p>
              {SUGGESTION_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.target}
                    type="button"
                    onClick={() => submit(query, cat.target)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className="shrink-0 text-[#0B6E99]" weight="duotone" />
                      <span className="truncate">
                        {cat.prefix}
                        <strong className="text-[#102A43]">{query.trim()}</strong>
                      </span>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-[#627D98]" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-1">
              <p className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#627D98]">
                Quick Healthcare Directories
              </p>
              {SUGGESTION_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.target}
                    type="button"
                    onClick={() => {
                      setFocused(false);
                      router.push(cat.href(""));
                    }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-[#0B6E99]" weight="duotone" />
                      <span className="font-medium text-[#102A43]">{cat.title}</span>
                    </div>
                    <ArrowRight size={14} className="text-[#627D98]" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {showShortcuts && shortcuts.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {shortcuts.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.href) {
                  router.push(item.href);
                  return;
                }
                setQuery(item.label);
                submit(item.label);
              }}
              className="rounded-full border border-[#102A43]/10 bg-white px-3 py-1.5 text-[12px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/35 hover:text-[#0B6E99]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

