"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "@phosphor-icons/react";
import { publicContentApi } from "@/lib/api/index";

const ACTION_HREF = {
  prescription: "/prescriptions/upload",
  doctors: "/doctors",
  clinic: "/doctors",
  pharmacy: "/vendors",
  labs: "/lab-tests",
  hospitals: "/hospitals",
};

export function CampaignBanners() {
  const { data } = useQuery({
    queryKey: ["content", "banners", "website"],
    queryFn: () => publicContentApi.get("banners", "website"),
    staleTime: 5 * 60 * 1000,
  });

  const banners = (data?.items || []).filter((item) => item.section === "banners");
  if (banners.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-14">
      <div className="home-container mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners.map((banner) => {
            const href =
              banner.href || ACTION_HREF[banner.action] || "/doctors";
            return (
              <Link
                key={banner.id}
                href={href}
                className="group overflow-hidden rounded-[20px] border border-[#102A43]/08 bg-[#F1F7FA] transition-shadow hover:shadow-[0_12px_32px_rgba(16,42,67,0.08)]"
                style={banner.bg ? { backgroundColor: banner.bg } : undefined}
              >
                {banner.image_url ? (
                  <img
                    src={banner.image_url}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="p-5">
                  {banner.badge ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B6E99]">
                      {banner.badge}
                    </p>
                  ) : null}
                  <h3 className="mt-1 text-[18px] font-semibold text-[#102A43]">
                    {banner.title}
                  </h3>
                  {banner.subtitle ? (
                    <p className="mt-1 text-[14px] text-[#627D98]">{banner.subtitle}</p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E99]">
                    {banner.cta || "Learn more"}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
