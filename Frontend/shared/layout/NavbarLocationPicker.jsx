"use client";

import { useEffect, useState } from "react";
import { MapPin, Spinner, NavigationArrow } from "@phosphor-icons/react";
import { reverseGeocode } from "@/lib/location";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

export function NavbarLocationPicker({ className }) {
  const [currentLocation, setCurrentLocation] = useState("Lahore");
  const [isGpsDetected, setIsGpsDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("medzoos_user_city");
    const savedGps = localStorage.getItem("medzoos_user_city_gps") === "true";
    if (saved) {
      setCurrentLocation(saved);
      setIsGpsDetected(savedGps);
    } else {
      detectLiveLocation(true);
    }
  }, []);

  const updateLocation = (city, isGps = true) => {
    setCurrentLocation(city);
    setIsGpsDetected(isGps);
    if (typeof window !== "undefined") {
      localStorage.setItem("medzoos_user_city", city);
      localStorage.setItem("medzoos_user_city_gps", isGps ? "true" : "false");
      window.dispatchEvent(
        new CustomEvent("medzoos-location-changed", { detail: { city, isGps } })
      );
    }
  };

  const detectLiveLocation = (silent = false) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      if (!silent) toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await reverseGeocode(latitude, longitude);
          const city = data.locality || data.city || data.localityName || "Lahore";
          updateLocation(city, true);
          if (!silent) {
            toast.success(`Live location updated: ${city}`);
          }
        } catch {
          if (!silent) toast.error("Could not detect live location.");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        if (!silent) {
          if (err.code === 1) {
            toast.error("Location permission denied in browser settings.");
          } else {
            toast.error("Unable to retrieve live location.");
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className={cn("inline-block", className)}>
      <button
        type="button"
        onClick={() => detectLiveLocation(false)}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl border border-[#0B6E99]/25 bg-[#F1F7FA] px-3 py-1.5 text-left transition-all hover:border-[#0B6E99]/50 hover:bg-[#EAF7F5] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0B6E99]/30 shadow-xs cursor-pointer"
        aria-label="Fetch live location"
        title="Click to fetch live location"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0B6E99]/10 text-[#0B6E99]">
          {isLoading ? (
            <Spinner size={14} className="animate-spin text-[#0B6E99]" />
          ) : isGpsDetected ? (
            <NavigationArrow size={14} weight="fill" className="text-[#0B6E99]" />
          ) : (
            <MapPin size={14} weight="bold" className="text-[#0B6E99]" />
          )}
        </span>

        <span className="max-w-[130px] truncate text-[13px] font-bold text-[#102A43]">
          {isLoading ? "Detecting..." : currentLocation}
        </span>
      </button>
    </div>
  );
}
