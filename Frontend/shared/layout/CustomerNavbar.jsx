"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShoppingCart,
  CaretDown,
  Spinner,
  Tag,
  FileArrowUp,
  List,
  X,
  House,
  Pill,
  Stethoscope,
  Flask,
  Storefront,
  Receipt,
  User,
} from "@phosphor-icons/react";
import { BrandLogo } from "@/shared/branding/BrandLogo";
import { cartApi } from "@/lib/api/index";
import { useUserProfile } from "@/lib/hooks/useApi";
import { useAuth } from "@/lib/auth/AuthProvider";
import { usePrescriptionModal } from "@/features/prescription/context/PrescriptionModalContext";
import { GlobalSearch } from "@/features/home/components/patient/GlobalSearch";
import { UserMenu } from "@/features/home/components/patient/UserMenu";
import { CustomerNotificationInbox } from "@/shared/notifications/NotificationInbox";
import { cn } from "@/utils/cn";

const HIGHLIGHTS = [
  { label: "Diabetes medicines & devices", tone: "success" },
  { label: "Psychologist support for diabetes burnout", tone: "neutral" },
  { label: "HbA1c & sugar labs at home", tone: "accent" },
];

export function CustomerNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openPrescriptionModal } = usePrescriptionModal();
  const [cartCount, setCartCount] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("Karachi");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasToken = isAuthenticated;
  const authUiReady = !authLoading;

  const { data: profile, isLoading: isProfileLoading } = useUserProfile({
    retry: false,
    enabled: hasToken,
  });
  const profileRole = profile?.role;
  const profileId = profile?.id ?? null;

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          setCurrentLocation(data.city || data.locality || "Location found");
        } catch {
          setCurrentLocation("Unknown Location");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLoadingLocation(false);
      }
    );
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isProfileLoading && profileRole === "admin") {
      window.location.href = "/admin";
    }

    const updateCartCount = async () => {
      try {
        if (isAuthenticated) {
          try {
            const data = await cartApi.get();
            const items = data.cart?.items || data.items || [];
            setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
          } catch {
            const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
            setCartCount(guestCart.reduce((acc, item) => acc + item.quantity, 0));
          }
        } else {
          const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          setCartCount(guestCart.reduce((acc, item) => acc + item.quantity, 0));
        }
      } catch {
        /* ignore cart sync errors in chrome */
      }
    };

    if (!authLoading) updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("auth-updated", updateCartCount);
    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("auth-updated", updateCartCount);
    };
  }, [authLoading, isAuthenticated, pathname, isProfileLoading, profileId, profileRole]);

  return (
    <>
      {/* Top Notification Strip */}
      <div className="w-full border-b border-[#102A43]/06 bg-[#F1F7FA]">
        <div className="home-container mx-auto flex h-9 md:h-10 items-center overflow-x-auto scrollbar-hide px-3 sm:px-6">
          <div className="flex min-w-max items-center gap-4 text-[11px] text-[#627D98] md:gap-6">
            {HIGHLIGHTS.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    item.tone === "success" && "bg-[#22A06B]",
                    item.tone === "accent" && "bg-[#0B6E99]",
                    item.tone === "neutral" && "bg-[#16A9E0]"
                  )}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white transition-shadow",
          scrolled ? "border-[#102A43]/08 shadow-[0_4px_20px_rgba(16,42,67,0.06)]" : "border-[#102A43]/06"
        )}
      >
        <div className="home-container mx-auto px-3 sm:px-6">
          <div className="flex h-[72px] md:h-[80px] items-center justify-between gap-1.5 sm:gap-4">
            {/* Left: Brand Logo & Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden items-center justify-center p-1.5 rounded-xl text-[#102A43] hover:bg-[#F1F7FA] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
              </button>
              <BrandLogo href="/" className="shrink-0" />
            </div>

            {/* Desktop Search Input */}
            <div className="mx-auto hidden min-w-0 flex-1 max-w-[560px] md:block">
              <GlobalSearch />
            </div>

            {/* Right Action Icons Group */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={fetchLocation}
                className="hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-[13px] text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99] lg:inline-flex"
                aria-label="Update delivery location"
              >
                {isLoadingLocation ? (
                  <Spinner size={18} className="animate-spin" />
                ) : (
                  <MapPin size={18} />
                )}
                <span className="max-w-[110px] truncate font-medium">{currentLocation}</span>
                <CaretDown size={12} />
              </button>

              {/* Upload Rx Button (Visible on tablet & desktop) */}
              <button
                type="button"
                onClick={() => openPrescriptionModal()}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#0B6E99]/30 bg-[#EAF7F5] px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-extrabold text-[#0B6E99] transition-colors hover:bg-[#0B6E99] hover:text-white shadow-xs"
                aria-label="Upload Prescription"
              >
                <FileArrowUp size={16} weight="bold" />
                <span>Upload Rx</span>
              </button>

              <Link
                href="/offers"
                className={cn(
                  "relative hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99] sm:inline-flex",
                  pathname === "/offers" ? "text-[#0B6E99]" : "text-[#334E68]"
                )}
              >
                <Tag size={18} />
                <span>Offers</span>
                <span className="rounded-full bg-[#D64545]/90 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                  HOT
                </span>
              </Link>

              <CustomerNotificationInbox isAuthenticated={isAuthenticated} />

              <Link
                href="/cart"
                className="relative rounded-xl p-2 text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0B6E99] px-1 text-[10px] font-bold text-white shadow-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>

              {!authUiReady ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#F1F7FA]" />
              ) : isAuthenticated ? (
                <UserMenu profile={profile} />
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname || "/")}`}
                  className="rounded-xl bg-[#0B6E99] px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#073B4C]"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-3 md:hidden">
            <GlobalSearch />
          </div>
        </div>

        {/* Mobile Navigation Drawer Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#102A43]/10 bg-white px-4 py-4 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                Healthcare Navigation
              </p>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === "/" ? "bg-[#EAF7F5] text-[#0B6E99]" : "text-[#102A43] hover:bg-slate-50"
                )}
              >
                <House size={18} className="text-[#0B6E99]" />
                Home
              </Link>
              <Link
                href="/browse"
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname.startsWith("/browse") ? "bg-[#EAF7F5] text-[#0B6E99]" : "text-[#102A43] hover:bg-slate-50"
                )}
              >
                <Pill size={18} className="text-[#0B6E99]" />
                Medicines & Pharmacy
              </Link>
              <Link
                href="/doctors"
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname.startsWith("/doctors") ? "bg-[#EAF7F5] text-[#0B6E99]" : "text-[#102A43] hover:bg-slate-50"
                )}
              >
                <Stethoscope size={18} className="text-[#0B6E99]" />
                Doctors & Telehealth
              </Link>
              <Link
                href="/lab-tests"
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname.startsWith("/lab-tests") ? "bg-[#EAF7F5] text-[#0B6E99]" : "text-[#102A43] hover:bg-slate-50"
                )}
              >
                <Flask size={18} className="text-[#0B6E99]" />
                Diagnostic Lab Tests
              </Link>
              <Link
                href="/vendors"
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname.startsWith("/vendors") ? "bg-[#EAF7F5] text-[#0B6E99]" : "text-[#102A43] hover:bg-slate-50"
                )}
              >
                <Storefront size={18} className="text-[#0B6E99]" />
                Pharmacies Directory
              </Link>

              <div className="pt-2 border-t border-slate-100 my-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                  Quick Actions
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPrescriptionModal();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#0B6E99] bg-[#EAF7F5] hover:bg-[#0B6E99] hover:text-white transition-colors text-left"
                >
                  <FileArrowUp size={18} />
                  Upload Medical Prescription
                </button>
                <Link
                  href="/offers"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#102A43] hover:bg-slate-50 transition-colors"
                >
                  <Tag size={18} className="text-rose-500" />
                  Special Offers & Deals
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/account/appointments"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#102A43] hover:bg-slate-50 transition-colors"
                  >
                    <Receipt size={18} className="text-[#0B6E99]" />
                    My Appointments & Orders
                  </Link>
                )}
              </div>

              {/* Location Picker in Drawer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#0B6E99]" />
                  <span>City: <strong>{currentLocation}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={fetchLocation}
                  className="text-[#0B6E99] font-bold hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
