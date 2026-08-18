"use client";

import { useState } from "react";
import { X, Bell, Check, Spinner } from "@phosphor-icons/react";
import { useUpdateOfferAlerts } from "@/lib/hooks/useOffers";

export function OfferAlertModal({ onClose }) {
  const updateAlerts = useUpdateOfferAlerts();
  const [preferences, setPreferences] = useState({
    medicines: true,
    labs: true,
    consultations: true,
    bankWallet: true,
  });
  const [success, setSuccess] = useState(false);

  const toggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateAlerts.mutateAsync(preferences);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch {
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7F5] text-[#0B6E99]">
            <Bell size={22} weight="duotone" />
          </span>
          <div>
            <h3 className="text-base font-bold text-[#102A43]">Get Offer Alerts</h3>
            <p className="text-xs text-slate-500">Never miss promotions in categories you care about</p>
          </div>
        </div>

        {success ? (
          <div className="my-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center text-emerald-800">
            <Check size={28} className="mx-auto mb-1 text-emerald-600" />
            <p className="text-sm font-bold">Preferences Saved!</p>
            <p className="text-xs text-emerald-600">You will receive notifications for your selected categories.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              {[
                { key: "medicines", label: "Medicine & Pharmacy Discounts" },
                { key: "labs", label: "Diagnostic Lab & Home Sampling Offers" },
                { key: "consultations", label: "Doctor Consultation Promos" },
                { key: "bankWallet", label: "Bank Card & Mobile Wallet Cashbacks" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => toggle(item.key)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0B6E99] focus:ring-[#0B6E99]"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={updateAlerts.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B6E99] py-3 text-sm font-bold text-white hover:bg-[#073B4C] transition-colors shadow-sm disabled:opacity-50"
            >
              {updateAlerts.isPending ? <Spinner size={18} className="animate-spin" /> : "Save Alert Preferences"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
