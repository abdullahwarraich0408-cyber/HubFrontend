"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export function GlobalSearch({
  placeholder = "Search medicines, doctors, psychologists, labs...",
  size = "md",
  className,
  shortcuts = [],
  showShortcuts = false,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = (value = query) => {
    const q = String(value || "").trim();
    if (!q) return;
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

  return (
    <div className={cn("w-full", className)}>
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
        <MagnifyingGlass
          size={size === "lg" ? 20 : 18}
          className="shrink-0 text-[#0B6E99]"
          weight="bold"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-[#102A43] outline-none placeholder:text-[#627D98]",
            size === "lg" ? "text-[15px] md:text-[16px]" : "text-[13px] md:text-[14px]"
          )}
          aria-label="Search healthcare services"
        />
        <button
          type="submit"
          className="hidden shrink-0 rounded-full bg-[#0B6E99] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#073B4C] sm:inline-flex"
        >
          Search
        </button>
      </form>

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
