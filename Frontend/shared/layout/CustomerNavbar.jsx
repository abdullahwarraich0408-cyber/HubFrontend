"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FirstAidKit,
  MapPin,
  Bell,
  ShoppingCart,
  CaretDown,
  Spinner,
  Tag,
} from "@phosphor-icons/react";
import { cartApi } from "@/lib/api/index";
import { useUserProfile } from "@/lib/hooks/useApi";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GlobalSearch } from "@/features/home/components/patient/GlobalSearch";
import { UserMenu } from "@/features/home/components/patient/UserMenu";
import { cn } from "@/utils/cn";

const HIGHLIGHTS = [
  { label: "Diabetes medicines & devices", tone: "success" },
  { label: "Psychologist support for diabetes burnout", tone: "neutral" },
  { label: "HbA1c & sugar labs at home", tone: "accent" },
];

export function CustomerNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("Karachi");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="w-full border-b border-[#102A43]/06 bg-[#F1F7FA]">
        <div className="home-container mx-auto flex h-10 items-center overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max items-center gap-5 text-[11px] text-[#627D98] md:gap-6">
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

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white transition-shadow",
          scrolled ? "border-[#102A43]/08 shadow-[0_1px_0_rgba(16,42,67,0.06)]" : "border-[#102A43]/06"
        )}
      >
        <div className="home-container mx-auto">
          <div className="flex h-[72px] items-center gap-3 md:gap-4">
            <Link
              href={isAuthenticated ? "/" : "/"}
              className="flex shrink-0 items-center gap-2.5"
              aria-label="Medzoos home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F5] text-[#0B6E99]">
                <FirstAidKit size={20} weight="fill" />
              </span>
              <span className="font-extrabold text-[20px] tracking-tight text-[#102A43]">
                Med<span className="text-[#0B6E99]">zoos</span>
              </span>
            </Link>

            <div className="mx-auto hidden min-w-0 flex-1 max-w-[560px] md:block">
              <GlobalSearch />
            </div>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
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

              <Link
                href="/offers"
                className={cn(
                  "relative hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99] sm:inline-flex",
                  pathname === "/offers" ? "text-[#0B6E99]" : "text-[#334E68]"
                )}
              >
                <Tag size={18} />
                Offers
                <span className="rounded-full bg-[#D64545]/90 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                  HOT
                </span>
              </Link>

              <button
                type="button"
                className="relative rounded-xl p-2.5 text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>

              <Link
                href="/cart"
                className="relative rounded-xl p-2.5 text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
                aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0B6E99] px-1 text-[10px] font-bold text-white">
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

          <div className="pb-3 md:hidden">
            <GlobalSearch />
          </div>
        </div>
      </header>
    </>
  );
}
