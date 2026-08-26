"use client";

import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { 
  Truck, 
  ThermometerCold, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Stethoscope, 
  Flask, 
  Package, 
  CurrencyDollar, 
  CheckCircle,
  ChatCircleDots,
  FileText
} from "@phosphor-icons/react";

const SHIPPING_SECTIONS = [
  { id: "overview", title: "1. Service Delivery & Shipping Overview" },
  { id: "delivery-timelines", title: "2. Delivery Timelines & SLA" },
  { id: "cold-chain", title: "3. Cold-Chain & Temperature-Regulated Logistics" },
  { id: "rx-verification", title: "4. Prescription Verification Prior to Dispatch" },
  { id: "telehealth-delivery", title: "5. Service Delivery: Doctor & Telehealth Consultations" },
  { id: "lab-sampling-delivery", title: "6. Service Delivery: Diagnostic Labs & Home Sampling" },
  { id: "shipping-charges", title: "7. Shipping Charges & Free Delivery Thresholds" },
  { id: "coverage-areas", title: "8. Delivery Coverage & City Zones Across Pakistan" },
  { id: "order-tracking", title: "9. Order Tracking & Real-Time Status Updates" },
  { id: "delivery-attempts", title: "10. Delivery Attempts, Address Corrections & Re-routing" },
];

export function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping & Service Delivery"
      subtitle="Complete information on delivery timeframes, cold-chain temperature safety, nationwide shipping zones, and digital fulfillment for labs & doctor consultations."
      lastUpdated="August 25, 2026"
      type="shipping"
      sections={SHIPPING_SECTIONS}
    >
      <div className="space-y-10">

        {/* Section 1 */}
        <section id="overview" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Truck size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              1. Service Delivery & Shipping Overview
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Medzoos operates a dedicated healthcare fulfillment network designed to deliver authentic medicines, diagnostic laboratory sample collections, and telehealth clinical services safely, rapidly, and reliably to patients across Pakistan.
            </p>
            <div className="p-4 rounded-xl bg-brand-mist border border-brand-light flex items-start gap-3 text-neutral-800 text-xs sm:text-sm">
              <ShieldCheck size={20} className="text-brand-primary shrink-0 mt-0.5" weight="fill" />
              <div>
                <strong className="font-semibold block mb-1">Authenticity & Temperature Integrity Commitment</strong>
                All medicines are sourced exclusively from licensed retail and hospital pharmacies, verified by registered pharmacists, and transported in protective temperature-controlled packaging.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="delivery-timelines" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Clock size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              2. Delivery Timelines & SLA
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Delivery time depends on your geographic location, order placement hour, and whether the medication requires cold-chain handling:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">FASTEST</span>
                <strong className="block font-bold text-ink-headline text-sm">Express Delivery</strong>
                <p className="text-neutral-600"><strong>2 – 4 Hours</strong> in major urban zones (Karachi, Lahore, Islamabad) for urgent prescription medicines and essential OTC products.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-brand-light text-brand-primary font-bold text-[10px]">STANDARD</span>
                <strong className="block font-bold text-ink-headline text-sm">Same-Day / 24 Hours</strong>
                <p className="text-neutral-600">Orders confirmed before 4:00 PM are delivered on the same day or next morning across major cities.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">NATIONWIDE</span>
                <strong className="block font-bold text-ink-headline text-sm">24 – 48 Hours</strong>
                <p className="text-neutral-600">Secondary cities, towns, and remote regions across Punjab, Sindh, KPK, and Balochistan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="cold-chain" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ThermometerCold size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              3. Cold-Chain & Temperature-Regulated Logistics
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Medications like Insulin, fertility hormones, biologics, eye drops, and vaccines lose therapeutic potency when exposed to ambient heat. We implement an uncompromising cold-chain protocol:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <CheckCircle size={18} className="text-brand-primary shrink-0 mt-0.5" weight="fill" />
                <span><strong>Insulated Packaging:</strong> Packaged in multi-layer insulated cool boxes equipped with calibrated phase-change gel ice packs maintaining 2°C – 8°C.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <CheckCircle size={18} className="text-brand-primary shrink-0 mt-0.5" weight="fill" />
                <span><strong>Priority Transit:</strong> Cold-chain shipments are prioritized for express direct-route courier dispatch to minimize transit duration.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <CheckCircle size={18} className="text-brand-primary shrink-0 mt-0.5" weight="fill" />
                <span><strong>Doorstep Temperature Verification:</strong> Riders are equipped to show temperature indicators upon patient request before handover.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="rx-verification" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <FileText size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              4. Prescription Verification Prior to Dispatch
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              To maintain the highest medical compliance, orders containing Rx prescription medications are subject to pharmacist approval prior to packing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600">
              <li>Our licensed pharmacist reviews your uploaded doctor's prescription within <strong>15–30 minutes</strong> of order placement.</li>
              <li>If the prescription is valid, the order status changes to <em>&quot;Verified &amp; Dispensing&quot;</em> and is dispatched immediately.</li>
              <li>If dosage or medication details need clarification, our pharmacy team will call you or your physician before proceeding.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="telehealth-delivery" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Stethoscope size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              5. Service Delivery: Doctor & Telehealth Consultations
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Doctor consultations and mental health appointments booked through Medzoos are delivered digitally:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200 space-y-1">
                <strong className="text-ink-headline font-bold block">Instant Digital Room Link:</strong>
                <p className="text-neutral-600">Encrypted video/audio consultation link is generated instantly in your appointment dashboard and sent via SMS &amp; Email.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-neutral-200 space-y-1">
                <strong className="text-ink-headline font-bold block">Digital Prescription Delivery:</strong>
                <p className="text-neutral-600">After the consultation, the doctor&apos;s digital e-prescription is automatically attached to your patient vault and can be fulfilled in 1-click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="lab-sampling-delivery" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Flask size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              6. Service Delivery: Diagnostic Labs & Home Sampling
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              For home pathology diagnostics (e.g. HbA1c, lipid profiles, full blood counts, kidney/liver panels):
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-neutral-600">
              <li><strong>Phlebotomist Arrival:</strong> A certified, trained phlebotomist visits your doorstep at your selected time slot equipped with sterile vacutainers and PPE.</li>
              <li><strong>Cold Transport of Blood Samples:</strong> Samples are placed immediately in regulated centrifuge transport coolers and transferred directly to the testing laboratory.</li>
              <li><strong>Report Delivery Timeline:</strong> Digital verified PDF reports are uploaded to your Medzoos account within <strong>6 to 24 hours</strong> (routine tests) or up to 48 hours for specialized diagnostic cultures.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="shipping-charges" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <CurrencyDollar size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              7. Shipping Charges & Free Delivery Thresholds
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We believe in transparent, upfront delivery rates with no hidden surcharges:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                <thead className="bg-surface-subtle border-b border-neutral-200 text-ink-headline font-bold">
                  <tr>
                    <th className="p-3">Order Type / Tier</th>
                    <th className="p-3">Standard Delivery Fee</th>
                    <th className="p-3">Free Delivery Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Standard Medicine Orders</td>
                    <td className="p-3">PKR 150</td>
                    <td className="p-3 text-emerald-600 font-bold">Free on orders above PKR 1,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Express Same-Day Delivery</td>
                    <td className="p-3">PKR 250</td>
                    <td className="p-3">Free on orders above PKR 3,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Cold-Chain Temperature Box</td>
                    <td className="p-3">PKR 100 (Cooler Packaging)</td>
                    <td className="p-3 text-emerald-600 font-bold">Free with Monthly Diabetes Bundles</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Lab Test Home Sampling</td>
                    <td className="p-3">PKR 300</td>
                    <td className="p-3 text-emerald-600 font-bold">Free on Lab Orders above PKR 2,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="coverage-areas" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <MapPin size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              8. Delivery Coverage & City Zones Across Pakistan
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Medzoos proudly serves patients throughout Pakistan through our expanding multi-city logistics and vendor ecosystem:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Zone 1 (Express &amp; Same-Day Hubs):</strong>
                <p className="text-neutral-600">Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Hyderabad, Gujranwala, Sialkot, Quetta.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Zone 2 (Nationwide Standard 24–48h):</strong>
                <p className="text-neutral-600">All other districts, tehsils, and towns across Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, and AJK.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section id="order-tracking" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Package size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              9. Order Tracking & Real-Time Status Updates
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Stay informed at every step of your order and service journey:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600">
              <li><strong>SMS &amp; WhatsApp Alerts:</strong> Receive automatic real-time alerts when your prescription is verified, packed by pharmacy, out for delivery, and delivered.</li>
              <li><strong>Live Rider Tracking:</strong> For express deliveries, track the courier rider in real time on our digital map in the <em>Track Order</em> tab.</li>
              <li><strong>Phlebotomist ETA:</strong> Live notification when your lab sample collection agent is on the way to your home.</li>
            </ul>
          </div>
        </section>

        {/* Section 10 */}
        <section id="delivery-attempts" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ChatCircleDots size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              10. Delivery Attempts, Address Corrections & Re-routing
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              If our delivery agent is unable to reach you upon arrival:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600">
              <li>The rider will make up to <strong>3 phone call attempts</strong> to the primary number listed on your account.</li>
              <li>If unreachable, the package will return to the local hub and a second delivery attempt will be scheduled automatically on the following business day.</li>
              <li>To update your delivery address or instructions, contact our dispatch helpline at <a href="tel:+923001234567" className="text-brand-primary font-bold hover:underline">+92 300 123 4567</a> or email <a href="mailto:support@medzoos.pk" className="text-brand-primary font-bold hover:underline">support@medzoos.pk</a>.</li>
            </ul>
          </div>
        </section>

      </div>
    </LegalPageLayout>
  );
}
