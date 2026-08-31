"use client";

import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { 
  ArrowsCounterClockwise, 
  Pill, 
  Stethoscope, 
  Flask, 
  ThermometerCold, 
  CreditCard, 
  WarningCircle, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  FileArrowUp, 
  Envelope,
  ChatCircleDots
} from "@phosphor-icons/react";

const REFUND_SECTIONS = [
  { id: "overview", title: "1. Overview & General Policy" },
  { id: "medicine-returns", title: "2. Medicine & Pharmacy Product Returns" },
  { id: "non-returnable", title: "3. Non-Returnable Healthcare Items" },
  { id: "cold-chain-policy", title: "4. Cold-Chain & Temperature Breaches" },
  { id: "doctor-cancellations", title: "5. Doctor & Telehealth Consultations" },
  { id: "lab-tests-refunds", title: "6. Diagnostic Lab Tests & Home Sampling" },
  { id: "refund-timelines", title: "7. Refund Methods & Timelines" },
  { id: "return-request-process", title: "8. How to Request a Return or Refund" },
  { id: "disputes-contact", title: "9. Claims, Disputes & Support" },
];

export function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Return & Refund"
      subtitle="Transparent guidelines on order cancellations, pharmaceutical product returns, diagnostic test reimbursements, and telehealth appointment refunds."
      lastUpdated="August 25, 2026"
      type="refund"
      sections={REFUND_SECTIONS}
    >
      <div className="space-y-10">

        {/* Section 1 */}
        <section id="overview" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ArrowsCounterClockwise size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              1. Overview & General Policy
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              At <strong>Medzoos</strong>, our mission is to ensure patient safety, highest medical standards, and complete transparency in every healthcare interaction. Because we facilitate the delivery of sensitive pharmaceuticals, medical devices, laboratory tests, and professional doctor consultations, our Return and Refund Policy is designed in strict compliance with the <strong>Drug Regulatory Authority of Pakistan (DRAP)</strong> safety guidelines and applicable consumer protection laws.
            </p>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-950 text-xs sm:text-sm">
              <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
              <div>
                <strong className="font-semibold block mb-1">Patient Safety First Guarantee</strong>
                If you receive an incorrect, damaged, expired, or compromised product, we will replace the item or provide a 100% refund upon prompt verification.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="medicine-returns" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Pill size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              2. Medicine & Pharmacy Product Returns
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Pharmaceutical orders fulfilled by our licensed partner pharmacies are eligible for return or replacement under the following specific circumstances:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <strong className="text-ink-headline font-semibold block">Damaged or Broken Items:</strong>
                <p className="text-neutral-600">Physical damage, shattered bottles, or punctured blister packs observed upon delivery.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <strong className="text-ink-headline font-semibold block">Incorrect Medication or Strength:</strong>
                <p className="text-neutral-600">Dispatched medicine does not match your prescription or confirmed digital order.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <strong className="text-ink-headline font-semibold block">Expired / Near-Expiry Products:</strong>
                <p className="text-neutral-600">Products received with less than 3 months remaining shelf life (unless explicitly agreed upon as discounted clearance).</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <strong className="text-ink-headline font-semibold block">Missing Items / Incomplete Order:</strong>
                <p className="text-neutral-600">Shortage in the quantity of medicines received versus the verified billing invoice.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <strong className="font-semibold block mb-0.5">Reporting Window:</strong>
              Claims for physical damage, wrong item, or missing count must be lodged within <strong>48 hours</strong> of package delivery with photographic evidence.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="non-returnable" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <WarningCircle size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              3. Non-Returnable Healthcare Items
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Under DRAP regulatory safety protocols and pharmaceutical integrity standards, the following products cannot be returned or refunded once successfully delivered with intact seal:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-neutral-600">
              <li><strong>Opened or Unsealed Medicines:</strong> Any medicine box, foil, bottle, or vial whose manufacturer seal, tamper tape, or cap has been broken or removed.</li>
              <li><strong>Personal Hygiene & Sanitization Items:</strong> Breast pumps, maternity pads, thermometers, masks, gloves, catheters, and adult diapers.</li>
              <li><strong>Opened Medical Devices:</strong> Blood glucose monitors (glucometers), strips, lancets, nebulizers, or BP cuffs once packaging is unsealed.</li>
              <li><strong>Special Order & Imported Drugs:</strong> Non-formulary or rare medications procured exclusively on custom patient request.</li>
              <li><strong>Change of Mind:</strong> We cannot accept returns if the patient no longer requires the medication due to a change of prescription after safe dispatch.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="cold-chain-policy" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ThermometerCold size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              4. Cold-Chain & Temperature Breaches
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Temperature-sensitive biological items—including <strong>Insulin vials & cartridges, GLP-1 pens, vaccines, eye drops, and hormonal injections</strong>—require strict temperature maintenance between <strong>2°C and 8°C</strong>.
            </p>
            <div className="p-4 rounded-xl bg-brand-mist border border-brand-light text-xs sm:text-sm space-y-2 text-neutral-800">
              <strong className="text-brand-primary font-bold block">Cold-Chain Return & Replacement Conditions:</strong>
              <p>
                Our riders transport cold-chain products in insulated temperature-monitored cooler bags with ice packs.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700">
                <li>Inspect cold-chain items immediately at your doorstep in the presence of the courier rider.</li>
                <li>If the gel pack is completely warm or the product packaging is melted or warm, refuse delivery or notify us within <strong>2 hours</strong> of receipt.</li>
                <li>Once accepted and stored in your home refrigerator, cold-chain items cannot be returned due to lack of verifiable continuous temperature monitoring.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="doctor-cancellations" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Stethoscope size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              5. Doctor & Telehealth Consultations
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We respect both patient schedules and the professional time of verified doctors on Medzoos.
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Patient Cancellation & Full Refund:</strong>
                <p className="text-neutral-600">
                  You may cancel or reschedule a scheduled doctor consultation up to <strong>2 hours</strong> prior to the appointment time for a 100% refund or free slot reschedule.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Doctor No-Show or Unavailability:</strong>
                <p className="text-neutral-600">
                  If the doctor is unable to join the session within 15 minutes of the scheduled time or cancels the appointment, you are entitled to an immediate full refund or complimentary priority rebooking.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <strong className="text-ink-headline font-semibold block mb-1">Completed Consultations & Patient No-Shows:</strong>
                <p className="text-neutral-600">
                  Consultation fees for sessions that were attended and completed by the physician are non-refundable. Patients who fail to join without 2-hour advance notice will forfeit the consultation fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="lab-tests-refunds" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Flask size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              6. Diagnostic Lab Tests & Home Sampling
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              For diagnostic laboratory bookings and at-home phlebotomy sample collections:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-neutral-600">
              <li><strong>Cancellation before Phlebotomist Dispatch:</strong> 100% refund if cancelled at least 2 hours before the scheduled home sampling window.</li>
              <li><strong>Cancellation at Doorstep:</strong> A nominal sampling transport fee (PKR 300) may be deducted if the phlebotomist arrives at your designated address and the appointment is cancelled on site.</li>
              <li><strong>Sample Contamination / Lab Processing Failure:</strong> If a sample is rejected or damaged by the diagnostic laboratory machine, we will conduct a free re-sampling or issue a 100% full refund.</li>
              <li><strong>Completed Lab Reports:</strong> Once samples are drawn, processed, and validated digital reports are uploaded, testing fees cannot be refunded.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="refund-timelines" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <CreditCard size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              7. Refund Methods & Timelines
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Once a return is received, inspected by our pharmacists, or a cancellation is approved, refunds are processed according to the original payment method:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                <thead className="bg-surface-subtle border-b border-neutral-200 text-ink-headline font-bold">
                  <tr>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Refund Destination</th>
                    <th className="p-3">Estimated Processing Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Medzoos Wallet Credits</td>
                    <td className="p-3">Medzoos Patient Wallet</td>
                    <td className="p-3 text-emerald-600 font-bold">Instant (Within 1 hour)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">JazzCash / EasyPaisa</td>
                    <td className="p-3">Original Mobile Wallet Account</td>
                    <td className="p-3">1 – 3 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Credit / Debit Card (Visa/Mastercard)</td>
                    <td className="p-3">Issuing Bank Account</td>
                    <td className="p-3">5 – 10 Business Days (subject to bank policy)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-900">Cash on Delivery (COD)</td>
                    <td className="p-3">Medzoos Wallet or Direct Bank Transfer (IBAN)</td>
                    <td className="p-3">2 – 4 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="return-request-process" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <FileArrowUp size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              8. How to Request a Return or Refund
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>Requesting a return or refund is simple and fast through our digital patient portal:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold inline-flex items-center justify-center text-xs">1</span>
                <strong className="block font-bold text-ink-headline">Go to Orders</strong>
                <p className="text-neutral-500">Navigate to your Account &gt; Order History and select the affected order ID.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold inline-flex items-center justify-center text-xs">2</span>
                <strong className="block font-bold text-ink-headline">Submit Details & Photo</strong>
                <p className="text-neutral-500">Click &quot;Request Return / Refund&quot;, choose reason, and upload clear photo evidence.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold inline-flex items-center justify-center text-xs">3</span>
                <strong className="block font-bold text-ink-headline">Pickup & Reimbursement</strong>
                <p className="text-neutral-500">Our rider picks up the item and your refund is credited upon pharmacy verification.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section id="disputes-contact" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ChatCircleDots size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              9. Claims, Disputes & Support
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              If your return request has not been processed to your satisfaction or you have urgent queries regarding billing, our dedicated patient advocacy and pharmacy support team is ready to assist:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <strong className="text-ink-headline font-bold block">Refund & Billing Support Desk:</strong>
                <div>Email: <a href="mailto:accounts@medzoos.pk" className="text-brand-primary font-semibold hover:underline">accounts@medzoos.pk</a></div>
                <div>Helpline: <a href="tel:+923001234567" className="text-brand-primary font-semibold hover:underline">+92 300 123 4567</a></div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <strong className="text-ink-headline font-bold block">Customer Operations Center:</strong>
                <div>Medzoos Digital Health Technologies</div>
                <div>DHA Phase 6, Karachi, Pakistan</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </LegalPageLayout>
  );
}
