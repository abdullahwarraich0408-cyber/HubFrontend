"use client";

import { useEffect, useMemo, useState } from "react";
import { Images, UploadSimple, FloppyDisk } from "@phosphor-icons/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminHomeSlides,
  useUpdateHomeSlide,
  useUploadImage,
} from "@/lib/hooks/useApi";

const ACTIONS = [
  { value: "prescription", label: "Upload prescription" },
  { value: "doctors", label: "Find doctors" },
  { value: "pharmacy", label: "Shop medicines" },
  { value: "labs", label: "Book lab test" },
  { value: "hospitals", label: "Find hospitals" },
];

function SlideEditor({ slide }) {
  const updateSlide = useUpdateHomeSlide();
  const uploadImage = useUploadImage();
  const [form, setForm] = useState({
    title: slide.title || "",
    cta: slide.cta || "",
    action: slide.action || "doctors",
    bg: slide.bg || "#17618E",
    image_url: slide.image_url || "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({
      title: slide.title || "",
      cta: slide.cta || "",
      action: slide.action || "doctors",
      bg: slide.bg || "#17618E",
      image_url: slide.image_url || "",
    });
  }, [slide.id, slide.title, slide.cta, slide.action, slide.bg, slide.image_url]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage.mutateAsync(file);
      const url = res?.url || res?.data?.url;
      if (!url) throw new Error("Upload did not return an image URL");
      setField("image_url", url);
      toast.success("Picture uploaded. Save to apply it.");
    } catch (err) {
      toast.error(err.message || "Failed to upload picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await updateSlide.mutateAsync({
        id: slide.id,
        title: form.title,
        cta: form.cta,
        action: form.action,
        bg: form.bg,
        image_url: form.image_url,
      });
      toast.success("Poster saved");
    } catch (err) {
      toast.error(err.message || "Failed to save poster");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col"
    >
      <div
        className="relative h-[140px] px-5 py-4 flex items-end"
        style={{ backgroundColor: form.bg }}
      >
        <div className="max-w-[58%] text-white">
          <p className="text-[15px] font-extrabold leading-5 line-clamp-2">
            {form.title || "Poster title"}
          </p>
          <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-white text-[#082B3F] text-[11px] font-bold">
            {form.cta || "Button"}
          </span>
        </div>
        {form.image_url ? (
          <img
            src={form.image_url}
            alt=""
            className="absolute right-2 bottom-0 h-[128px] w-auto object-contain"
          />
        ) : (
          <div className="absolute right-4 bottom-4 text-white/70 text-[11px] font-semibold">
            Default 3D graphic
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-[12px] font-semibold text-ink-headline">
          Title
          <input
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-[13px] font-medium"
            maxLength={80}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-[12px] font-semibold text-ink-headline">
          Button text
          <input
            value={form.cta}
            onChange={(e) => setField("cta", e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-[13px] font-medium"
            maxLength={32}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-[12px] font-semibold text-ink-headline">
          Opens
          <select
            value={form.action}
            onChange={(e) => setField("action", e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-[13px] font-medium bg-white"
          >
            {ACTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[12px] font-semibold text-ink-headline">
          Card color
          <input
            type="color"
            value={form.bg}
            onChange={(e) => setField("bg", e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-neutral-300 text-[12px] font-semibold text-[#17618E] cursor-pointer hover:bg-[#DEEEF9]">
          <UploadSimple size={16} weight="bold" />
          {uploading ? "Uploading..." : "Change picture"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        <button
          type="submit"
          disabled={updateSlide.isPending}
          className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[#17618E] hover:bg-[#082B3F] text-white text-[13px] font-semibold"
        >
          <FloppyDisk size={16} weight="bold" />
          {updateSlide.isPending ? "Saving..." : "Save poster"}
        </button>
      </div>
    </form>
  );
}

function PosterGrid({ title, subtitle, slides }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-[20px] font-bold text-ink-headline">{title}</h2>
        <p className="text-[13px] text-neutral-500 mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {slides.map((slide) => (
          <SlideEditor key={slide.id} slide={slide} />
        ))}
      </div>
    </section>
  );
}

export default function AdminHomePostersPage() {
  const { data: slides = [], isLoading } = useAdminHomeSlides();

  const firstVisit = useMemo(
    () =>
      slides
        .filter((slide) => slide.audience === "first_visit")
        .sort((a, b) => a.slot - b.slot),
    [slides]
  );
  const offers = useMemo(
    () =>
      slides
        .filter((slide) => slide.audience === "returning")
        .sort((a, b) => a.slot - b.slot),
    [slides]
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1280px]">
      <div className="mb-8">
        <Link href="/admin/content" className="text-[13px] text-[#17618E] font-semibold">
          ← Content hub
        </Link>
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight flex items-center gap-2 mt-2">
          <Images size={28} className="text-[#17618E]" />
          Home posters
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1">
          First-time users see the intro cards. From the second visit they see the offer cards.
          Change the title, button, destination, color, and picture for each poster.
        </p>
      </div>

      {isLoading ? (
        <p className="text-neutral-500">Loading posters...</p>
      ) : (
        <>
          <PosterGrid
            title="First visit"
            subtitle="Shown the first time someone opens the app."
            slides={firstVisit}
          />
          <PosterGrid
            title="Offers"
            subtitle="Shown from the second visit onward."
            slides={offers}
          />
        </>
      )}
    </div>
  );
}
