"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, FloppyDisk, Trash, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  useAdminContent,
  useCreateContentItem,
  useUpdateContentItem,
  useDeleteContentItem,
  useUploadImage,
} from "@/lib/hooks/useApi";

const ACTIONS = [
  { value: "", label: "None" },
  { value: "doctors", label: "Find doctors" },
  { value: "clinic", label: "Clinic visit" },
  { value: "pharmacy", label: "Shop medicines" },
  { value: "labs", label: "Book lab test" },
  { value: "hospitals", label: "Find hospitals" },
  { value: "prescription", label: "Upload prescription" },
];

const SECTIONS = {
  "care-actions": {
    key: "care_actions",
    title: "Care shortcuts",
    subtitle: "Tiles on the user app home under Your care. Add more if you need a new shortcut.",
    fields: ["title", "subtitle", "icon", "action", "href", "channel"],
  },
  specialties: {
    key: "specialties",
    title: "Specialities",
    subtitle: "Chips on the user app and website home. Add a speciality whenever you launch a new one.",
    fields: ["title", "icon", "meta", "href", "action", "channel"],
  },
  banners: {
    key: "banners",
    title: "Banners",
    subtitle: "Extra campaign cards for the app or website. Add a banner, upload a picture, and set where it opens.",
    fields: ["title", "subtitle", "cta", "action", "href", "bg", "image_url", "badge", "channel"],
  },
};

function ItemForm({ item, sectionKey, fields, onSaved }) {
  const updateItem = useUpdateContentItem();
  const deleteItem = useDeleteContentItem();
  const uploadImage = useUploadImage();
  const [form, setForm] = useState(item);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

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
      await updateItem.mutateAsync({ id: item.id, ...form, section: sectionKey });
      toast.success("Saved");
      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this item?")) return;
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className={`bg-white rounded-[16px] border border-neutral-200 p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${form.is_active === false ? "opacity-60" : ""}`}
    >
      {fields.includes("image_url") && form.image_url ? (
        <img src={form.image_url} alt="" className="h-28 w-full object-cover rounded-xl" />
      ) : null}
      {fields.includes("title") && (
        <label className="text-[12px] font-semibold">
          Title
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.title || ""}
            onChange={(e) => setField("title", e.target.value)}
            required
          />
        </label>
      )}
      {fields.includes("subtitle") && (
        <label className="text-[12px] font-semibold">
          Subtitle
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.subtitle || ""}
            onChange={(e) => setField("subtitle", e.target.value)}
          />
        </label>
      )}
      {fields.includes("cta") && (
        <label className="text-[12px] font-semibold">
          Button text
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.cta || ""}
            onChange={(e) => setField("cta", e.target.value)}
          />
        </label>
      )}
      {fields.includes("icon") && (
        <label className="text-[12px] font-semibold">
          Icon name
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.icon || ""}
            onChange={(e) => setField("icon", e.target.value)}
            placeholder="stethoscope"
          />
        </label>
      )}
      {fields.includes("meta") && (
        <label className="text-[12px] font-semibold">
          Doctor specialty filter
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.meta || ""}
            onChange={(e) => setField("meta", e.target.value)}
            placeholder="Cardiologist"
          />
        </label>
      )}
      {fields.includes("action") && (
        <label className="text-[12px] font-semibold">
          Opens in app
          <select
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px] bg-white"
            value={form.action || ""}
            onChange={(e) => setField("action", e.target.value)}
          >
            {ACTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {fields.includes("href") && (
        <label className="text-[12px] font-semibold">
          Website link
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.href || ""}
            onChange={(e) => setField("href", e.target.value)}
            placeholder="/doctors"
          />
        </label>
      )}
      {fields.includes("bg") && (
        <label className="text-[12px] font-semibold">
          Card color
          <input
            type="color"
            className="mt-1 h-10 w-full rounded-lg border border-neutral-200"
            value={form.bg || "#17618E"}
            onChange={(e) => setField("bg", e.target.value)}
          />
        </label>
      )}
      {fields.includes("badge") && (
        <label className="text-[12px] font-semibold">
          Badge
          <input
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
            value={form.badge || ""}
            onChange={(e) => setField("badge", e.target.value)}
          />
        </label>
      )}
      {fields.includes("channel") && (
        <label className="text-[12px] font-semibold">
          Show on
          <select
            className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px] bg-white"
            value={form.channel || "both"}
            onChange={(e) => setField("channel", e.target.value)}
          >
            <option value="both">App and website</option>
            <option value="app">User app only</option>
            <option value="website">Website only</option>
          </select>
        </label>
      )}
      <label className="text-[12px] font-semibold">
        Order
        <input
          type="number"
          min="0"
          className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px]"
          value={form.sort_order ?? 0}
          onChange={(e) => setField("sort_order", Number(e.target.value))}
        />
      </label>
      <label className="flex items-center gap-2 text-[12px] font-semibold">
        <input
          type="checkbox"
          checked={form.is_active !== false}
          onChange={(e) => setField("is_active", e.target.checked)}
        />
        Visible on app / website
      </label>
      {fields.includes("image_url") && (
        <label className="flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-neutral-300 text-[12px] font-semibold text-[#17618E] cursor-pointer">
          <UploadSimple size={16} />
          {uploading ? "Uploading..." : "Change picture"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      )}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 h-10 rounded-lg bg-[#17618E] text-white text-[13px] font-semibold flex items-center justify-center gap-2"
        >
          <FloppyDisk size={16} />
          Save
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="h-10 px-3 rounded-lg border border-red-200 text-red-600"
        >
          <Trash size={16} />
        </button>
      </div>
    </form>
  );
}

export default function ContentSectionPage() {
  const params = useParams();
  const slug = params.section;
  const config = SECTIONS[slug];
  const { data, isLoading } = useAdminContent(config?.key);
  const createItem = useCreateContentItem();

  const items = useMemo(
    () => (data?.items || []).filter((item) => item.section === config?.key),
    [data, config]
  );

  if (!config) {
    return <p className="text-neutral-500">Unknown section.</p>;
  }

  const handleAdd = async () => {
    try {
      await createItem.mutateAsync({
        section: config.key,
        title: "New item",
        channel: config.key === "care_actions" ? "app" : "both",
        action: "doctors",
      });
      toast.success("Item added. Edit it below.");
    } catch (err) {
      toast.error(err.message || "Failed to add item");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1200px]">
      <Link href="/admin/content" className="inline-flex items-center gap-1 text-[13px] text-[#17618E] font-semibold mb-4">
        <ArrowLeft size={14} /> Content hub
      </Link>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">
            {config.title}
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 max-w-[640px]">{config.subtitle}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#17618E] text-white text-sm font-semibold"
        >
          <Plus size={16} weight="bold" />
          Add
        </button>
      </div>

      {isLoading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemForm
              key={item.id}
              item={item}
              sectionKey={config.key}
              fields={config.fields}
            />
          ))}
        </div>
      )}
    </div>
  );
}
