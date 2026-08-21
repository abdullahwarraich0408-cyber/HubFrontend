"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "@phosphor-icons/react";

export function NotificationBannerHost() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const onAlert = (event) => {
      const item = event.detail;
      if (!item?.title) return;
      setBanner({
        id: item.id || String(Date.now()),
        title: item.title,
        message: item.message || "",
        link: item.link || null,
      });
    };

    window.addEventListener("inbox-notification-alert", onAlert);
    return () => window.removeEventListener("inbox-notification-alert", onAlert);
  }, []);

  useEffect(() => {
    if (!banner) return undefined;
    const timer = window.setTimeout(() => setBanner(null), 7000);
    return () => window.clearTimeout(timer);
  }, [banner]);

  if (!banner) return null;

  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-9 h-9 rounded-xl bg-[#17618E] text-white flex items-center justify-center shrink-0">
        <Bell size={18} weight="fill" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-[#082B3F] leading-snug">{banner.title}</p>
        {banner.message ? (
          <p className="text-[12px] text-[#475569] mt-0.5 leading-relaxed line-clamp-2">
            {banner.message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setBanner(null)}
        className="p-1 rounded-md text-[#94A3B8] hover:text-[#082B3F] hover:bg-slate-100"
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[min(420px,calc(100vw-24px))]">
      <div className="rounded-2xl border border-[#D9DEE5] bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(8,43,63,0.18)] px-3.5 py-3">
        {banner.link ? (
          <Link href={banner.link} onClick={() => setBanner(null)} className="block">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
