"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FirstAidKit, MapPin, Bell, User, ShoppingCart, List, CaretDown, MagnifyingGlass, X, Package, Spinner } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks/useApi";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

export function CustomerNavbar() {
  const pathname = usePathname();
  const { openSignIn } = useAuthModal();
  const isTrackingRoute =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/prescription") ||
    pathname.startsWith("/track");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Karachi");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Check token safely for SSR
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

  // Fetch profile to check if user is an admin
  const { data: profile, isLoading: isProfileLoading } = useUserProfile({
    retry: false,
    enabled: hasToken,
  });

  useEffect(() => {
    // If an admin accidentally lands on the customer UI, force them to the admin dashboard
    if (!isProfileLoading && profile?.role === 'admin') {
      window.location.href = "/admin";
    }
  }, [profile, isProfileLoading]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await res.json();
        if (data.city || data.locality) {
          setCurrentLocation(data.city || data.locality);
        } else {
          setCurrentLocation("Location found");
        }
      } catch (err) {
        console.error(err);
        setCurrentLocation("Unknown Location");
      } finally {
        setIsLoadingLocation(false);
      }
    }, (error) => {
      console.error(error);
      alert("Unable to retrieve your location");
      setIsLoadingLocation(false);
    });
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      setIsLoggedIn(false);
      setCartCount(0);
      
      // Notify components like Cart
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }

      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    // If an admin accidentally lands on the customer UI, force them to the admin dashboard
    if (!isProfileLoading && profile?.role === 'admin') {
      window.location.href = "/admin";
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);

    const updateCartCount = async () => {
      const activeToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setIsLoggedIn(!!activeToken);

      try {
        if (activeToken) {
          try {
            const data = await api.cart.get();
            const items = data.cart?.items || data.items || [];
            const count = items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
          } catch (err) {
            const message = err?.message?.toLowerCase() || "";
            const isBenign =
              message.includes("jwt expired") ||
              message.includes("unable to reach the server") ||
              message.includes("failed to fetch") ||
              message.includes("network request failed");

            if (!isBenign) {
              console.error("Failed to fetch cart count in navbar", err);
            }
            // Fallback to guest cart without removing user token
            const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            const count = guestCart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
          }
        } else {
          const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
          const count = guestCart.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(count);
        }
      } catch (err) {
        const message = err?.message?.toLowerCase() || "";
        const isBenign =
          message.includes("jwt expired") ||
          message.includes("unable to reach the server") ||
          message.includes("failed to fetch") ||
          message.includes("network request failed");

        if (!isBenign) {
          console.error("Failed to fetch cart count in navbar", err);
        }
      }
    };

    updateCartCount();

    if (typeof window !== 'undefined') {
      window.addEventListener('cart-updated', updateCartCount);
      window.addEventListener('auth-updated', updateCartCount);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cart-updated', updateCartCount);
        window.removeEventListener('auth-updated', updateCartCount);
      }
    };
  }, [pathname, isProfileLoading, profile ? profile.id : null]);

  return (
    <>
      {/* Top Trust Bar */}
      <div className="w-full bg-gradient-to-r from-brand-mist via-surface-subtle to-brand-mist border-b border-neutral-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(11,110,114,0.04)_50%,transparent_100%)] animate-[shimmer_8s_linear_infinite]"></div>
        <div className="w-full home-container mx-auto min-h-[32px] py-1.5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-0 relative">
          <div className="hidden sm:flex items-center gap-6 text-[10px] sm:text-[11px] text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="relative flex items-center justify-center">
                <span className="absolute w-1.5 h-1.5 rounded-full bg-status-success opacity-60 animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
              </span>
              <span className="font-medium text-center">Authentic Medicines Guaranteed</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="text-neutral-300">•</span>
              <span>Free Delivery on Orders over PKR 2,000</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <span className="text-neutral-300">•</span>
              <span className="font-medium text-brand-primary">24/7 Customer Support</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-neutral-600">
            <Link href="/contact" className="hover:text-brand-primary transition-colors font-medium">Help Center</Link>
            <span className="text-neutral-300 sm:hidden">•</span>
            <Link
              href="/orders"
              className={`hover:text-brand-primary transition-colors font-medium ${isTrackingRoute ? "text-brand-primary" : ""}`}
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md shadow-navbar border-b border-neutral-200/60 supports-[backdrop-filter]:bg-white/70">
        <div className="w-full home-container mx-auto h-[64px] flex items-center justify-between">

          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-md icon-box-light flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
              <FirstAidKit size={20} className="text-brand-primary transition-transform duration-300 group-hover:scale-110" weight="fill" />
            </div>
            <span className="font-bold text-[18px] text-ink-headline tracking-tight">
              Pharma<span className="text-brand-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-[480px] mx-4">
            <div className="flex items-center gap-2 w-full bg-neutral-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
              <MagnifyingGlass size={18} className="text-brand-primary shrink-0" />
              <input
                type="text"
                placeholder="Search medicines, pharmacies, doctors, lab tests"
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-0.5 ml-auto shrink-0">
            {/* Location */}
            <button onClick={fetchLocation} className="flex items-center gap-1.5 text-[13px] text-neutral-700 hover:text-brand-primary transition-colors px-2.5 py-2 rounded-md hover:bg-brand-light">
              {isLoadingLocation ? <Spinner size={18} className="animate-spin" /> : <MapPin size={18} />}
              <span className="font-medium whitespace-nowrap">{currentLocation}</span>
              <CaretDown size={12} />
            </button>

            {/* Offers */}
            <Link
              href="/offers"
              className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium hover:text-brand-primary hover:bg-brand-light rounded-md transition-all ${pathname === "/offers" ? "text-brand-primary" : "text-neutral-600"}`}
            >
              Offers
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold text-white bg-[var(--color-status-danger)] rounded-full">HOT</span>
            </Link>

            {/* Orders */}
            <Link
              href="/orders"
              className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium hover:text-brand-primary hover:bg-brand-light rounded-md transition-all ${isTrackingRoute ? "text-brand-primary" : "text-neutral-600"}`}
            >
              <Package size={18} />
              <span>Orders</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-neutral-600 hover:text-brand-primary hover:bg-brand-light rounded-md transition-all" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full border-2 border-white"></span>
            </button>

            {/* Profile / Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 px-2.5 py-2 text-[13px] text-neutral-700">
                <Link href="/profile" className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center shrink-0 hover:ring-2 hover:ring-brand-primary/20 transition-all">
                  <User size={16} className="text-brand-primary" />
                </Link>
                <button onClick={handleLogout} className="font-medium hover:text-brand-primary transition-colors">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-2 text-[13px] text-neutral-700">
                <Link href="/profile" className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center shrink-0 hover:ring-2 hover:ring-brand-primary/20 transition-all">
                  <User size={16} className="text-brand-primary" />
                </Link>
                <button
                  type="button"
                  onClick={() => openSignIn({ redirect: pathname || "/" })}
                  className="font-medium hover:text-brand-primary transition-colors"
                >
                  Login
                </button>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart">
              <button className="relative flex items-center gap-2 text-white bg-brand-primary hover:bg-brand-dark transition-colors px-3 py-2 rounded-md ml-1">
                <ShoppingCart size={18} weight="bold" />
                <span className="text-[13px] font-semibold hidden lg:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-status-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-1 md:hidden ml-auto">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600"
              aria-label="Search"
            >
              <MagnifyingGlass size={20} />
            </button>
            <Link href="/cart" className="relative p-2 text-neutral-600">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-status-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>

        </div>

        {/* Search Bar - Expandable (mobile only) */}
        {searchOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-t border-neutral-200 bg-white shadow-xl animate-in slide-in-from-top duration-200 z-50">
            <div className="w-full home-container mx-auto py-3">
              <div className="flex items-center gap-2 bg-neutral-100 rounded-md px-4 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                <MagnifyingGlass size={20} className="text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search medicines, pharmacies, doctors, lab tests"
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-neutral-900"
                  autoFocus
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-700"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-t border-neutral-200 bg-white shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto z-40">
            <nav className="w-full mx-auto px-4 py-3 flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors ${pathname === "/" ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>Home</Link>
              <Link href="/browse" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors ${pathname === "/browse" ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>Browse</Link>
              <Link href="/vendors" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors ${pathname === "/vendors" ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>Pharmacies</Link>
              <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors flex items-center justify-between ${pathname === "/offers" ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>
                Offers
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold text-white bg-[var(--color-status-danger)] rounded-full">HOT</span>
              </Link>
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors flex items-center gap-2 ${isTrackingRoute ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>
                <Package size={18} />
                Track Order
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors ${pathname === "/contact" ? "text-brand-primary bg-brand-light/50" : "text-neutral-700"}`}>Contact</Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors text-neutral-700 text-left">Sign Out</button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignIn({ redirect: pathname || "/" });
                  }}
                  className="px-4 py-2.5 text-[14px] font-medium hover:bg-brand-light rounded-md transition-colors text-neutral-700 text-left w-full"
                >
                  Sign In
                </button>
              )}
              <div onClick={fetchLocation} className="px-4 py-2.5 mt-2 border-t border-neutral-100 flex items-center gap-2 text-[13px] text-neutral-500 cursor-pointer hover:text-brand-primary">
                {isLoadingLocation ? <Spinner size={16} className="animate-spin" /> : <MapPin size={16} />}
                <span>Delivering to {currentLocation}</span>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
