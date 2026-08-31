"use client";

import React, { useState } from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { toast } from "sonner";
import { 
  Cookie, 
  Sliders, 
  CheckCircle, 
  LockKey, 
  ChartBar, 
  Megaphone, 
  Gear, 
  Globe, 
  Info,
  SlidersHorizontal,
  Check
} from "@phosphor-icons/react";

const COOKIE_SECTIONS = [
  { id: "preference-center", title: "1. Interactive Cookie Preference Center" },
  { id: "what-are-cookies", title: "2. What Are Cookies?" },
  { id: "how-medzoos-uses-cookies", title: "3. How Medzoos Uses Cookies" },
  { id: "types-of-cookies", title: "4. Types of Cookies We Set" },
  { id: "cookie-inventory", title: "5. Detailed Cookie Inventory Table" },
  { id: "managing-cookies", title: "6. Managing Cookies in Your Browser" },
  { id: "updates-contact", title: "7. Policy Updates & Contact Information" },
];

export function CookiePolicyPage() {
  // Cookie preference state
  const [preferences, setPreferences] = useState({
    essential: true, // Always active
    analytics: true,
    functional: true,
    marketing: false,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    if (key === "essential") return; // cannot toggle essential
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSavePreferences = () => {
    // Save to localStorage if client side
    try {
      localStorage.setItem("medzoos_cookie_preferences", JSON.stringify(preferences));
    } catch (e) {
      // fallback
    }
    setSaved(true);
    toast.success("Cookie Preferences Saved!", {
      description: "Your privacy settings have been updated for Medzoos.",
    });
  };

  const handleAcceptAll = () => {
    const allOn = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allOn);
    try {
      localStorage.setItem("medzoos_cookie_preferences", JSON.stringify(allOn));
    } catch (e) {}
    setSaved(true);
    toast.success("All Cookies Accepted!", {
      description: "You have accepted all cookie categories.",
    });
  };

  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="Understand how Medzoos uses cookies, web beacons, and local storage, and customize your cookie preferences in real-time."
      lastUpdated="August 10, 2026"
      type="cookies"
      sections={COOKIE_SECTIONS}
    >
      <div className="space-y-10">

        {/* Section 1: Interactive Preference Center */}
        <section id="preference-center" className="bg-gradient-to-br from-brand-mist via-white to-surface-subtle p-6 sm:p-8 rounded-2xl border border-brand-light shadow-md scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-light">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-md">
                <SlidersHorizontal size={26} weight="bold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-headline">
                  Cookie Preference Center
                </h2>
                <p className="text-xs text-neutral-500">
                  Control which cookies Medzoos is allowed to store on your browser.
                </p>
              </div>
            </div>

            <button
              onClick={handleAcceptAll}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-ink-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <Check size={14} weight="bold" />
              <span>Accept All Cookies</span>
            </button>
          </div>

          {/* Interactive Toggles */}
          <div className="space-y-4">
            
            {/* Essential */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <LockKey size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-sm text-ink-headline">
                    Strictly Necessary / Essential Cookies
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Required for site navigation, secure user authentication, shopping cart memory, and prescription upload security. Cannot be turned off.
                </p>
              </div>
              <div className="shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 rounded text-brand-primary cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <ChartBar size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-sm text-ink-headline">
                    Analytics & Performance Cookies
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Helps us measure site traffic, identify popular medicines and telehealth doctor pages, and improve application loading speeds across Pakistan.
                </p>
              </div>
              <button
                onClick={() => handleToggle("analytics")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.analytics ? "bg-brand-primary" : "bg-neutral-300"
                }`}
                role="switch"
                aria-checked={preferences.analytics}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.analytics ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Functional */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <Gear size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-sm text-ink-headline">
                    Functional & Preference Cookies
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Remembers your delivery city selection (e.g. Karachi, Lahore, Islamabad), preferred language, and recent medicine search history.
                </p>
              </div>
              <button
                onClick={() => handleToggle("functional")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.functional ? "bg-brand-primary" : "bg-neutral-300"
                }`}
                role="switch"
                aria-checked={preferences.functional}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.functional ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Marketing */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <Megaphone size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-sm text-ink-headline">
                    Targeted Marketing & Advertising Cookies
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Allows partner networks to show relevant health offers, discount coupons, and lab package promotions tailored to your general interests.
                </p>
              </div>
              <button
                onClick={() => handleToggle("marketing")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.marketing ? "bg-brand-primary" : "bg-neutral-300"
                }`}
                role="switch"
                aria-checked={preferences.marketing}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.marketing ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-brand-light flex items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              {saved ? (
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle size={16} />
                  Preferences updated successfully!
                </span>
              ) : (
                <span>Click "Save Preferences" to apply your choices.</span>
              )}
            </div>
            <button
              onClick={handleSavePreferences}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-md"
            >
              <Sliders size={16} />
              <span>Save My Preferences</span>
            </button>
          </div>
        </section>

        {/* Section 2 */}
        <section id="what-are-cookies" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Cookie size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              2. What Are Cookies?
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Cookies are small text files stored on your computer, smartphone, or tablet when you visit websites. They act as a memory bank for web platforms, remembering your preferences, active shopping cart, and session state.
            </p>
            <p>
              In addition to cookies, Medzoos uses local web storage, session storage, and security tokens to maintain encrypted user sessions.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="how-medzoos-uses-cookies" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Globe size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              3. How Medzoos Uses Cookies
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>Medzoos uses cookies for essential healthcare platform operations:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200">
                <strong className="text-ink-headline font-bold block mb-1">Session & Authentication:</strong>
                Keeping you logged into your secure account while browsing medicines or reviewing lab reports.
              </div>
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200">
                <strong className="text-ink-headline font-bold block mb-1">Prescription Cart Security:</strong>
                Temporarily storing items added to cart prior to prescription verification and checkout.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="types-of-cookies" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Sliders size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              4. Types of Cookies We Set
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We categorize our cookies into First-Party (set directly by Medzoos) and Third-Party (set by authorized analytics or payment partners):
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600">
              <li><strong>Session Cookies:</strong> Temporary files deleted automatically when you close your web browser.</li>
              <li><strong>Persistent Cookies:</strong> Remain stored on your device for a defined duration (e.g. 30 days) to remember your login or location.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Inventory Table */}
        <section id="cookie-inventory" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ChartBar size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              5. Detailed Cookie Inventory Table
            </h2>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-surface-subtle text-ink-headline font-bold uppercase text-[11px] tracking-wider border-b border-neutral-200">
                <tr>
                  <th className="p-3">Cookie Identifier</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Primary Purpose</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white font-mono text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-brand-primary">medzoos_session</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">Essential</span></td>
                  <td className="p-3 font-sans">Medzoos.pk</td>
                  <td className="p-3 font-sans">Stores encrypted user session key & auth state</td>
                  <td className="p-3 font-sans">Session</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand-primary">medzoos_cart_id</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">Essential</span></td>
                  <td className="p-3 font-sans">Medzoos.pk</td>
                  <td className="p-3 font-sans">Preserves cart items across page refreshes</td>
                  <td className="p-3 font-sans">7 Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand-primary">medzoos_city_pref</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-sans font-bold">Functional</span></td>
                  <td className="p-3 font-sans">Medzoos.pk</td>
                  <td className="p-3 font-sans">Stores preferred delivery city (Karachi/Lahore etc)</td>
                  <td className="p-3 font-sans">30 Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand-primary">_ga / _gid</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-sans font-bold">Analytics</span></td>
                  <td className="p-3 font-sans">Google Analytics</td>
                  <td className="p-3 font-sans">Aggregated website traffic & usability telemetry</td>
                  <td className="p-3 font-sans">2 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6 */}
        <section id="managing-cookies" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Gear size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              6. Managing Cookies in Your Browser
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              In addition to our Preference Center, you can manage or block cookies directly through your internet browser settings:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl border border-neutral-200 bg-surface-subtle font-semibold text-ink-headline">
                Google Chrome
              </div>
              <div className="p-3 rounded-xl border border-neutral-200 bg-surface-subtle font-semibold text-ink-headline">
                Mozilla Firefox
              </div>
              <div className="p-3 rounded-xl border border-neutral-200 bg-surface-subtle font-semibold text-ink-headline">
                Apple Safari
              </div>
              <div className="p-3 rounded-xl border border-neutral-200 bg-surface-subtle font-semibold text-ink-headline">
                Microsoft Edge
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="updates-contact" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Info size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              7. Policy Updates & Contact Information
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              For questions regarding our cookie practices or data privacy, please reach out to our team at{" "}
              <a href="mailto:security@medzoos.pk" className="text-brand-primary font-bold hover:underline">
                security@medzoos.pk
              </a>.
            </p>
          </div>
        </section>

      </div>
    </LegalPageLayout>
  );
}
