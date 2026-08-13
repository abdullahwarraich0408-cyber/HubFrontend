"use client";

import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { 
  ShieldCheck, 
  LockKey, 
  UserCheck, 
  FileText, 
  Crosshair, 
  Database, 
  Buildings, 
  ShareNetwork, 
  Eye, 
  Info,
  WarningCircle
} from "@phosphor-icons/react";

const PRIVACY_SECTIONS = [
  { id: "overview", title: "1. Overview & Commitment" },
  { id: "info-collected", title: "2. Information We Collect" },
  { id: "prescription-health-data", title: "3. Health Data & Prescription Privacy" },
  { id: "how-we-use", title: "4. How We Use Your Information" },
  { id: "sharing-third-parties", title: "5. Data Sharing & Third Parties" },
  { id: "security-storage", title: "6. Data Security & Encryption" },
  { id: "your-rights", title: "7. Your Data Rights & Control" },
  { id: "cookies-tracking", title: "8. Cookies & Tracking Technologies" },
  { id: "children-privacy", title: "9. Children's Privacy" },
  { id: "updates-contact", title: "10. Policy Updates & Contact Details" },
];

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How Medzoos collects, protects, uses, and safeguards your medical records, prescription data, and personal information."
      lastUpdated="August 10, 2026"
      type="privacy"
      sections={PRIVACY_SECTIONS}
    >
      <div className="space-y-10">

        {/* Section 1 */}
        <section id="overview" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ShieldCheck size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              1. Overview & Commitment
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              At <strong>Medzoos</strong> ("we", "our", or "us"), operated under Medzoos Digital Health Technologies, protecting your privacy and confidential health information is fundamental to our enterprise operations.
            </p>
            <p>
              This Privacy Policy explains how we collect, store, process, transfer, and safeguard your personal data when you use our website (medzoos.pk), mobile applications, digital prescription processing engine, telehealth platforms, and diagnostic test booking services.
            </p>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs sm:text-sm">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-1">Our Core Privacy Oath</strong>
                We treat your medical prescriptions, diagnostic reports, and personal identification as strictly confidential. We never sell your personal or sensitive health data to third-party data brokers or advertisers.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="info-collected" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Database size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              2. Information We Collect
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We gather information that allows us to deliver high-quality digital pharmacy, telehealth, and lab testing services across Pakistan:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200">
                <h3 className="font-bold text-ink-headline text-sm mb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-brand-primary" />
                  Personal Identification Data
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600">
                  <li>Full name, national identity (CNIC optional)</li>
                  <li>Email address & primary contact phone number</li>
                  <li>Physical delivery address & geolocation data</li>
                  <li>User account login credentials (encrypted)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200">
                <h3 className="font-bold text-ink-headline text-sm mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-brand-primary" />
                  Prescription & Medical Records
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600">
                  <li>Scanned prescription images and doctor notes</li>
                  <li>Active medications and dosage requirements</li>
                  <li>Telehealth consultation notes & history</li>
                  <li>Diagnostic lab test results and reports</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200">
                <h3 className="font-bold text-ink-headline text-sm mb-2 flex items-center gap-2">
                  <Crosshair size={16} className="text-brand-primary" />
                  Device & Technical Metadata
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600">
                  <li>IP address, browser type, operating system</li>
                  <li>Session identifiers & app diagnostic logs</li>
                  <li>Cookies, pixel tags, and local storage tokens</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200">
                <h3 className="font-bold text-ink-headline text-sm mb-2 flex items-center gap-2">
                  <LockKey size={16} className="text-brand-primary" />
                  Payment Information
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600">
                  <li>Transaction records & order history</li>
                  <li>Encrypted payment tokens via JazzCash / EasyPaisa / Cards</li>
                  <li><em>We do NOT store raw credit/debit card PINs or CVVs.</em></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="prescription-health-data" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <LockKey size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              3. Health Data & Prescription Privacy
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              As a healthcare marketplace, we maintain the highest standards regarding sensitive health data (SHD):
            </p>
            <ul className="space-y-3 font-normal">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-brand-mist border border-brand-light">
                <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></div>
                <div>
                  <strong className="text-ink-headline font-semibold">Strict Pharmacist & Doctor Access:</strong> Your uploaded prescriptions are accessible strictly to licensed pharmacists fulfilling your order and PMC/PMDC-registered medical practitioners assigned to your consultation.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-brand-mist border border-brand-light">
                <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></div>
                <div>
                  <strong className="text-ink-headline font-semibold">Encrypted Vault Storage:</strong> All medical documents stored in the Medzoos Family Health Vault are encrypted using AES-256 bit encryption at rest and TLS 1.3 in transit.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-brand-mist border border-brand-light">
                <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></div>
                <div>
                  <strong className="text-ink-headline font-semibold">No Automated Exploitation:</strong> We do not scan prescription documents for general advertising or profile building.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="how-we-use" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Eye size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              4. How We Use Your Information
            </h2>
          </div>
          <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>We process your personal information strictly for legitimate operational purposes:</p>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white shrink-0 mt-0.5">01</span>
                <div>
                  <strong className="text-ink-headline font-semibold">Order Fulfillment:</strong> Processing medicine orders, verifying prescriptions with licensed partner pharmacies, and dispatching deliveries.
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white shrink-0 mt-0.5">02</span>
                <div>
                  <strong className="text-ink-headline font-semibold">Telehealth Facilitation:</strong> Connecting patients with verified doctors for audio/video consultations and digital prescription issuance.
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white shrink-0 mt-0.5">03</span>
                <div>
                  <strong className="text-ink-headline font-semibold">Lab Test Booking & Reports:</strong> Scheduling sample collection from certified diagnostic labs and delivering secure digital PDF lab reports.
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white shrink-0 mt-0.5">04</span>
                <div>
                  <strong className="text-ink-headline font-semibold">Customer Care & Notifications:</strong> Sending SMS/WhatsApp delivery updates, refill reminders, and responding to support queries.
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white shrink-0 mt-0.5">05</span>
                <div>
                  <strong className="text-ink-headline font-semibold">Security & Compliance:</strong> Preventing fraudulent orders, illegal medicine requests, and ensuring adherence to drug laws.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="sharing-third-parties" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <ShareNetwork size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              5. Data Sharing & Third Parties
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              To complete your healthcare workflow, we selectively share necessary details with authorized entities bound by strict confidentiality contracts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-surface-subtle">
                <h4 className="font-bold text-ink-headline text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Buildings size={16} className="text-brand-primary" />
                  Licensed Partner Pharmacies
                </h4>
                <p className="text-xs text-neutral-600">
                  Shared prescription image, delivery address, and contact details so qualified pharmacists can dispense authentic medicines.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-surface-subtle">
                <h4 className="font-bold text-ink-headline text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-brand-primary" />
                  Registered Doctors & Clinics
                </h4>
                <p className="text-xs text-neutral-600">
                  Shared patient health history and consultation symptoms during active telehealth video/audio appointments.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-surface-subtle">
                <h4 className="font-bold text-ink-headline text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Database size={16} className="text-brand-primary" />
                  Logistics & Courier Partners
                </h4>
                <p className="text-xs text-neutral-600">
                  Delivery name, address, and phone number for physical package delivery across 1800+ Pakistan cities.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-surface-subtle">
                <h4 className="font-bold text-ink-headline text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <LockKey size={16} className="text-brand-primary" />
                  Payment Gateways & Regulators
                </h4>
                <p className="text-xs text-neutral-600">
                  Encrypted financial details sent to state-regulated payment processors and regulatory bodies when required by law.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="security-storage" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <LockKey size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              6. Data Security & Encryption
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We implement enterprise-grade security measures to safeguard your sensitive information from unauthorized access, loss, or disclosure:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-brand-mist border border-brand-light">
                <div className="font-bold text-brand-primary text-lg mb-1">256-Bit SSL</div>
                <div className="text-xs text-neutral-600 font-medium">Full Encryption in Transit</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-mist border border-brand-light">
                <div className="font-bold text-brand-primary text-lg mb-1">ISO / HIPAA</div>
                <div className="text-xs text-neutral-600 font-medium">Compliant Server Architecture</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-mist border border-brand-light">
                <div className="font-bold text-brand-primary text-lg mb-1">2FA & RBAC</div>
                <div className="text-xs text-neutral-600 font-medium">Strict Access Controls</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="your-rights" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <UserCheck size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              7. Your Data Rights & Control
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>You have full ownership and control over your personal data on Medzoos:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                <div>
                  <strong className="text-ink-headline font-semibold">Access & Export:</strong> Request a full export of your personal profile, order history, and family health vault documents.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                <div>
                  <strong className="text-ink-headline font-semibold">Correction & Update:</strong> Modify your personal account details, shipping addresses, or contact information at any time via your account settings.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                <div>
                  <strong className="text-ink-headline font-semibold">Right to Deletion:</strong> Request permanent deletion of your Medzoos profile and stored non-mandatory medical records by contacting <a href="mailto:privacy@medzoos.pk" className="text-brand-primary font-semibold hover:underline">privacy@medzoos.pk</a>.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                <div>
                  <strong className="text-ink-headline font-semibold">Marketing Opt-Out:</strong> Unsubscribe from promotional emails, SMS deals, or push notifications using the opt-out links provided in messages.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="cookies-tracking" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Eye size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              8. Cookies & Tracking Technologies
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We use cookies, web beacons, and local session tokens to ensure essential site navigation, remember your cart items, and analyze platform performance.
            </p>
            <p>
              For detailed choices and toggle controls, please visit our dedicated{" "}
              <a href="/cookie-policy" className="text-brand-primary font-bold hover:underline">
                Cookie Policy & Preference Center
              </a>.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="children-privacy" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <WarningCircle size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              9. Children's Privacy
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Medzoos services are intended for individuals aged 18 and older. Minors may use our platform only under the direct supervision of a parent or legal guardian who manages their family health profile.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="updates-contact" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary">
              <Info size={22} weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-ink-headline">
              10. Policy Updates & Contact Details
            </h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              We may update this Privacy Policy periodically to reflect changes in regulatory requirements or platform enhancements. We will notify you of any material changes via email or prominent site banner.
            </p>
            <div className="p-4 rounded-xl bg-surface-subtle border border-neutral-200 text-xs">
              <strong className="text-ink-headline font-bold block mb-1">Data Protection Officer (DPO) Contact:</strong>
              <div>Medzoos Digital Health Technologies</div>
              <div>DHA Phase 6, Karachi, Pakistan</div>
              <div>Email: <a href="mailto:privacy@medzoos.pk" className="text-brand-primary hover:underline font-semibold">privacy@medzoos.pk</a></div>
              <div>Support Line: +92 300 123 4567</div>
            </div>
          </div>
        </section>

      </div>
    </LegalPageLayout>
  );
}
