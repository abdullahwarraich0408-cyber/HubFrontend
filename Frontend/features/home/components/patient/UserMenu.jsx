"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  CaretDown,
  CalendarBlank,
  Package,
  Flask,
  MapPin,
  Prescription,
  GearSix,
  Question,
  SignOut,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { usePrescriptionModal } from "@/features/prescription/context/PrescriptionModalContext";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

function getFirstName(profile, user) {
  const raw = profile?.name || user?.name || "";
  const first = String(raw).trim().split(/\s+/)[0];
  return first || null;
}

const MENU_LINKS = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "My Appointments", href: "/account/appointments", icon: CalendarBlank },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "Lab Bookings", href: "/orders?type=lab", icon: Flask },
  { label: "Saved Addresses", href: "/profile?tab=addresses", icon: MapPin },
  { label: "Prescriptions", href: "/prescription", icon: Prescription },
  { label: "Settings", href: "/profile?tab=settings", icon: GearSix },
  { label: "Help", href: "/help", icon: Question },
];

export function UserMenu({ profile, className }) {
  const { user, logout } = useAuth();
  const { openPrescriptionModal } = usePrescriptionModal();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const firstName = getFirstName(profile, user);
  const initial = (firstName || "U").charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
      toast.success("Signed out successfully");
      router.push("/");
      window.location.href = "/";
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-left transition-colors hover:bg-[#F1F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]/35"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF7F5] text-[13px] font-semibold text-[#0B6E99]">
          {initial}
        </span>
        <span className="hidden lg:block">
          <span className="block text-[11px] leading-none text-[#627D98]">Hi,</span>
          <span className="mt-0.5 block max-w-[100px] truncate text-[13px] font-semibold text-[#102A43]">
            {firstName || "there"}
          </span>
        </span>
        <CaretDown
          size={12}
          weight="bold"
          className={cn("hidden text-[#627D98] transition-transform lg:block", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-2xl border border-[#102A43]/08 bg-white py-2 shadow-[0_16px_40px_rgba(16,42,67,0.14)]"
        >
          <div className="border-b border-[#102A43]/06 px-4 py-3">
            <p className="text-[14px] font-semibold text-[#102A43]">
              {firstName ? `Hi, ${firstName}` : "Your account"}
            </p>
            <p className="mt-0.5 truncate text-[12px] text-[#627D98]">
              {profile?.email || user?.email || "Manage your healthcare"}
            </p>
          </div>
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                openPrescriptionModal();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-[#0B6E99] transition-colors hover:bg-[#EAF7F5]"
            >
              <Prescription size={16} weight="bold" />
              Upload Prescription
            </button>
            {MENU_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-[#102A43]/06 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[#D64545] transition-colors hover:bg-[#FCE8E8]"
            >
              <SignOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { getFirstName };
