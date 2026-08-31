"use client";

import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { 
  FileText, 
  Scales, 
  WarningCircle, 
  ShoppingBag, 
  Stethoscope, 
  Flask, 
  CreditCard, 
  Truck, 
  ArrowsCounterClockwise, 
  Prohibit, 
  Gavel, 
  Info 
} from "@phosphor-icons/react";

const TERMS_SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms & Eligibility" },
  { id: "platform-nature", title: "2. Nature of Platform & Marketplace Role" },
  { id: "prescription-policy", title: "3. Prescription Medicine Policy" },
  { id: "telehealth-disclaimer", title: "4. Telehealth & Doctor Consultations" },
  { id: "lab-tests", title: "5. Lab Test Booking & Diagnostics" },
  { id: "payments-pricing", title: "6. Pricing, Payment & Billing" },
  { id: "shipping-delivery", title: "7. Shipping & Delivery Terms" },
  { id: "refunds-returns", title: "8. Cancellation, Returns & Refunds" },
  { id: "prohibited-use", title: "9. Prohibited Conduct & Misuse" },
  { id: "intellectual-property", title: "10. Intellectual Property Rights" },
  { id: "liability-indemnity", title: "11. Limitation of Liability & Indemnification" },
  { id: "governing-law", title: "12. Governing Law & Dispute Resolution" },
];

export function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="The binding legal agreement governing your access, purchases, telehealth consultations, and diagnostic bookings on Medzoos."
      lastUpdated="August 10, 2026"
      type="terms"
      sections={TERMS_SECTIONS}
    >
      <div className="space-y-10">

        {/* Section 1 */}
        <section id="acceptance" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <FileText size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              1. Acceptance of Terms & Eligibility
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Welcome to <strong>Medzoos</strong>. By accessing our platform, registering an account, purchasing medicines, booking doctor consultations, or scheduling lab tests, you enter into a legally binding agreement governed by these Terms of Service.
            </p>
            <p>
              If you do not agree to all terms set forth herein, you must immediately cease using the platform.
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
              <WarningCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-1">Age Requirement & Account Responsibility</strong>
                You must be at least 18 years of age or the legal age of majority in your jurisdiction to create a primary user account. Account credentials must remain confidential; you are liable for all activity originating from your registered profile.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="platform-nature" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ShoppingBag size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              2. Nature of Platform & Marketplace Role
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Medzoos operates as a multi-vendor digital healthcare technology marketplace connecting patients with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600">
              <li><strong>Licensed Retail Pharmacies:</strong> Authorized drug sellers responsible for dispensing authentic pharmaceuticals.</li>
              <li><strong>Verified Healthcare Practitioners:</strong> PMDC/PMC-registered medical doctors providing telehealth advice.</li>
              <li><strong>Certified Diagnostic Laboratories:</strong> Accredited pathology labs performing blood & diagnostic testing.</li>
            </ul>
            <p>
              Medzoos acts as a facilitator and digital platform provider. Orders for pharmaceutical items are fulfilled directly by licensed partner pharmacies in compliance with Drug Regulatory Authority of Pakistan (DRAP) regulations.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="prescription-policy" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Scales size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              3. Prescription Medicine Policy
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Certain medications on Medzoos are classified as <strong>Rx Only (Prescription Required)</strong> under Pakistani drug laws:
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Valid Upload Requirement:</strong>
                <p className="text-xs text-neutral-600">
                  You must upload a clear, legible image of a valid prescription issued by a licensed medical doctor containing the patient's name, doctor's registration number, date, and dosage instructions.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Pharmacist Verification:</strong>
                <p className="text-xs text-neutral-600">
                  Partner pharmacists reserve the absolute right to audit prescriptions. If a prescription is expired, illegible, forged, or suspicious, the order will be placed on hold or cancelled immediately.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Restricted Substances:</strong>
                <p className="text-xs text-neutral-600">
                  Schedule X narcotics, controlled psychotropic drugs, and high-risk restricted substances will not be dispensed online under any circumstances without verified in-person hospital documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="telehealth-disclaimer" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Stethoscope size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              4. Telehealth & Doctor Consultations
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-medium">
              <strong className="font-bold block mb-1 text-red-950">CRITICAL MEDICAL DISCLAIMER: NO EMERGENCY CARE</strong>
              Medzoos telehealth services are for non-emergency medical advice, general health queries, and routine consultations only. In the event of a medical emergency, chest pain, severe bleeding, or stroke symptoms, immediately call 1122 or visit the nearest emergency hospital.
            </div>
            <p>
              Doctors participating in the Medzoos network are independent medical professionals. The patient-doctor relationship is directly between you and the consulting physician. Medzoos does not practice medicine.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="lab-tests" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Flask size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              5. Lab Test Booking & Diagnostics
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Diagnostic lab test bookings arranged via Medzoos are conducted by ISO/CAP-certified pathology laboratories:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-neutral-600">
              <li>Home sample collection phlebotomists follow sterile safety protocols.</li>
              <li>Report delivery timelines are estimated based on test processing complexity (e.g. CBC within 6 hours, specialized cultures up to 72 hours).</li>
              <li>Digital PDF test reports delivered to your health vault are intended for diagnostic evaluation by your consulting physician.</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="payments-pricing" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <CreditCard size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              6. Pricing, Payment & Billing
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              All prices listed on Medzoos are in Pakistani Rupees (PKR) and inclusive of applicable government taxes unless specified otherwise:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200">
                <strong className="text-ink-headline font-bold block mb-1">Accepted Payment Methods:</strong>
                Cash on Delivery (COD), Visa / MasterCard, JazzCash, EasyPaisa, and Medzoos Wallet credits.
              </div>
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200">
                <strong className="text-ink-headline font-bold block mb-1">Price Adjustments:</strong>
                Medicine MRP prices are governed by DRAP regulations. In rare instances of manufacturer price changes, the final verified pharmacy price will prevail.
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="shipping-delivery" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Truck size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              7. Shipping & Cold-Chain Delivery Terms
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Delivery timeframes vary based on city location and product category (Standard Delivery: 24-48 hours; Express Same-Day in major cities):
            </p>
            <div className="p-4 rounded-xl bg-brand-mist border border-brand-light text-xs sm:text-sm text-neutral-700">
              <strong className="text-brand-primary font-bold block mb-1">Cold-Chain Temperature Guarantee:</strong>
              Insulin, vaccines, and temperature-sensitive biological items are transported in insulated gel-pack cold boxes maintaining 2°C – 8°C temperatures until handed over to the patient.
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="refunds-returns" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ArrowsCounterClockwise size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              8. Cancellation, Returns & Refunds
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Due to health safety and hygiene regulations, returns are subject to strict conditions:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Eligible for Return:</strong> Damaged packages, incorrect items dispatched, or expired items reported within 48 hours of delivery with original seal intact.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></span>
                <span><strong>Non-Returnable Items:</strong> Unsealed medicines, opened cold-chain items, personal hygiene products, and completed telehealth doctor consultations.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                <span><strong>Refund Processing:</strong> Approved refunds are credited to the original payment source or Medzoos Wallet within 5–7 business days.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section id="prohibited-use" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Prohibit size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              9. Prohibited Conduct & Misuse
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>Users are expressly forbidden from:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-neutral-600">
              <li>Uploading forged, fraudulent, or altered prescription documents.</li>
              <li>Reselling purchased medicines to third parties for commercial gain.</li>
              <li>Harassing or abusing consulting doctors, phlebotomists, or delivery agents.</li>
              <li>Attempting to breach, reverse-engineer, or overload Medzoos infrastructure.</li>
            </ul>
          </div>
        </section>

        {/* Section 10 */}
        <section id="intellectual-property" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <FileText size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              10. Intellectual Property Rights
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              All website content, software code, logos, trademarks ("Medzoos"), medical database schemas, design elements, and sound clips are the exclusive property of Medzoos Digital Health Technologies.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="liability-indemnity" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <WarningCircle size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              11. Limitation of Liability & Indemnification
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              To the maximum extent permitted by applicable law, Medzoos shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime, drug manufacturer defects, or patient misrepresentation of symptoms to consulting physicians.
            </p>
          </div>
        </section>

        {/* Section 12 */}
        <section id="governing-law" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Gavel size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              12. Governing Law & Dispute Resolution
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any dispute arising out of or in connection with these terms shall be submitted to binding arbitration in Karachi, Pakistan.
            </p>
            <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 text-xs">
              <strong className="text-ink-headline font-bold block mb-1">Legal Notice Department:</strong>
              <div>Medzoos Digital Health Technologies</div>
              <div>Email: <a href="mailto:admin@medzoos.pk" className="text-brand-primary hover:underline font-semibold">admin@medzoos.pk</a></div>
            </div>
          </div>
        </section>

      </div>
    </LegalPageLayout>
  );
}
