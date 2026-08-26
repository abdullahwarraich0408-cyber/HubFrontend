"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Question,
  MagnifyingGlass,
  X,
  Package,
  Stethoscope,
  Flask,
  FileText,
  CreditCard,
  UserCircle,
  CaretDown,
  ChatCircle,
  Envelope,
  Phone,
  WhatsappLogo,
  ArrowRight,
  Sparkle,
  Truck,
  ShieldCheck,
  Clock,
  FirstAid,
} from "@phosphor-icons/react";

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: Question },
  { id: "orders", label: "Orders & Delivery", icon: Package },
  { id: "doctors", label: "Doctor Consultations", icon: Stethoscope },
  { id: "labs", label: "Lab Tests & Sampling", icon: Flask },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "payments", label: "Payments & Refunds", icon: CreditCard },
  { id: "account", label: "Account & Security", icon: UserCircle },
];

const QUICK_ACTIONS = [
  {
    title: "Track Your Order",
    desc: "Check live delivery progress and courier details.",
    href: "/orders",
    cta: "Track Order",
    icon: Truck,
    accent: "bg-blue-50 text-[#0B6E99] border-blue-200/80",
  },
  {
    title: "My Appointments",
    desc: "Manage upcoming teleconsultations & clinic visits.",
    href: "/account/appointments",
    cta: "View Bookings",
    icon: Stethoscope,
    accent: "bg-purple-50 text-[#7C3AED] border-purple-200/80",
  },
  {
    title: "Lab Test Reports",
    desc: "Download verified diagnostic and blood test reports.",
    href: "/orders?type=lab",
    cta: "Check Reports",
    icon: Flask,
    accent: "bg-teal-50 text-[#0D9488] border-teal-200/80",
  },
  {
    title: "Upload Prescription",
    desc: "Submit a doctor's slip for pharmacist verification.",
    href: "/prescription",
    cta: "Upload Slip",
    icon: FileText,
    accent: "bg-emerald-50 text-[#059669] border-emerald-200/80",
  },
];

const FAQS = [
  // Orders & Delivery
  {
    category: "orders",
    q: "How do I track my medicine order?",
    a: "You can track your order in real time by going to the 'My Orders' section in your account. You will see live timeline updates from prescription verification, pharmacy dispatch, rider transit, to final doorstep delivery.",
  },
  {
    category: "orders",
    q: "What are the delivery charges and delivery times?",
    a: "Standard delivery typically takes 2 to 4 hours in major urban areas (Karachi, Lahore, Islamabad/Rawalpindi) and 24 to 48 hours for nationwide courier delivery. Free delivery is available on orders meeting the minimum order threshold shown at checkout.",
  },
  {
    category: "orders",
    q: "Can I cancel or change my order after placing it?",
    a: "You can cancel your order directly from the My Orders page before the pharmacy packages and dispatches it. If the order has already been dispatched, please contact our support team immediately for assistance.",
  },
  {
    category: "orders",
    q: "How does Medzoos guarantee medicine authenticity?",
    a: "All medications listed on Medzoos are supplied exclusively by licensed retail pharmacies and authorized pharmaceutical distributors registered with DRAP (Drug Regulatory Authority of Pakistan). We enforce batch and expiry tracking on all dispatched items.",
  },

  // Doctor Consultations
  {
    category: "doctors",
    q: "How do online video consultations work?",
    a: "Once you book a telehealth appointment, you will receive a secure video link in your appointment dashboard and via SMS/Email. At the scheduled time, simply click 'Join Consultation' to speak directly with your doctor. After the call, your digital prescription is saved to your account.",
  },
  {
    category: "doctors",
    q: "How do I receive my digital prescription after a consultation?",
    a: "Following your consultation, the doctor generates an official digital prescription that automatically appears in your 'Prescriptions' and 'Family Vault' tabs. You can immediately order the prescribed medicines with a single click.",
  },
  {
    category: "doctors",
    q: "Can I reschedule or cancel a doctor appointment?",
    a: "Yes. You can reschedule or cancel an appointment up to 2 hours before the scheduled slot from your Appointments page without any cancellation fee.",
  },
  {
    category: "doctors",
    q: "Are the doctors on Medzoos board-certified and PMDC registered?",
    a: "Yes. Every doctor, clinical psychologist, and specialist on Medzoos undergoes rigorous credential verification with PMDC (Pakistan Medical and Dental Council) or relevant licensing bodies prior to joining the platform.",
  },

  // Lab Tests & Sampling
  {
    category: "labs",
    q: "How does home sample collection work for diagnostic tests?",
    a: "When you book a test with home collection, a certified, trained phlebotomist visits your provided address at your chosen time slot. They follow sterile collection protocols and transport the samples in temperature-regulated containers to the partner laboratory.",
  },
  {
    category: "labs",
    q: "When and where will I get my diagnostic test reports?",
    a: "Digital lab reports are uploaded directly to your Medzoos account as soon as the laboratory verifies the findings (typically within 12 to 24 hours). You will receive an SMS/Email notification with a download link.",
  },
  {
    category: "labs",
    q: "Do I need to fast before my blood test?",
    a: "Certain tests (such as Fasting Blood Sugar, Lipid Profile, and Liver Function Tests) require 8 to 12 hours of fasting (water only). Each test card on Medzoos clearly specifies preparation instructions and fasting requirements.",
  },

  // Prescriptions
  {
    category: "prescriptions",
    q: "Why is a prescription required for certain medicines?",
    a: "Under Pakistani healthcare and DRAP regulations, Schedule G and antibiotic/controlled medicines require a valid doctor's prescription to ensure patient safety and avoid harmful drug interactions.",
  },
  {
    category: "prescriptions",
    q: "How long does prescription verification take?",
    a: "Our registered pharmacists review uploaded prescriptions within 15 to 30 minutes during operating hours. If anything requires clarification, our pharmacist will call you directly.",
  },
  {
    category: "prescriptions",
    q: "Can I upload a picture of a handwritten prescription?",
    a: "Yes. Clear photos or scans of handwritten or printed prescriptions from registered doctors are accepted. Please ensure the doctor's name, patient name, date, and medicines are legible.",
  },

  // Payments & Refunds
  {
    category: "payments",
    q: "What payment methods are supported on Medzoos?",
    a: "We support Cash on Delivery (COD), Visa/Mastercard debit and credit cards, Direct Bank Transfers, and mobile wallets including JazzCash and Easypaisa.",
  },
  {
    category: "payments",
    q: "What is your refund policy for cancelled orders or consultations?",
    a: "If an order or consultation is cancelled within the allowed cancellation window, prepaid amounts are refunded back to your original payment method within 3 to 7 business days, or credited instantly as Medzoos wallet balance.",
  },
  {
    category: "payments",
    q: "What if I receive the wrong medicine or a damaged package?",
    a: "We have a 100% replacement guarantee for damaged, expired, or incorrect items. Report the issue within 48 hours of delivery through your order screen or by contacting support, and we will arrange a replacement or refund.",
  },

  // Account & Security
  {
    category: "account",
    q: "How is my medical data and prescription history protected?",
    a: "Medzoos employs industry-standard 256-bit SSL encryption. Your medical data, appointment recordings, and prescriptions are strictly accessible only by you and the authorized healthcare provider handling your consultation or order.",
  },
  {
    category: "account",
    q: "How do I update my profile or delivery addresses?",
    a: "Navigate to your Profile page by clicking on your avatar or visiting '/profile'. You can add multiple delivery addresses (e.g. Home, Office, Parents) and set a default for one-click checkout.",
  },
];

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQS.filter((faq) => {
      const matchCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchSearch =
        !q ||
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] min-h-screen">
      {/* Header Banner with Interactive Search */}
      <section className="bg-gradient-to-b from-[#073B4C] via-[#0B6E99] to-[#0B6E99] text-white pt-24 pb-20 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#7DD3C7_0%,_transparent_60%)] opacity-20" />
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-bold tracking-widest uppercase mb-4 border border-white/20">
            <Question size={15} weight="bold" className="text-[#7DD3C7]" />
            Help Center & FAQ
          </div>
          <h1 className="text-[36px] sm:text-[44px] md:text-[54px] font-bold text-white tracking-tight leading-tight mb-4">
            How can we <span className="text-[#7DD3C7]">help you today?</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/85 max-w-xl mx-auto leading-relaxed mb-8">
            Search our knowledge base, explore frequent questions, or jump into quick self-service actions.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-[0_15px_35px_rgba(0,0,0,0.18)] border border-white/30 focus-within:ring-4 focus-within:ring-[#7DD3C7]/40 transition-all">
              <MagnifyingGlass
                size={22}
                weight="bold"
                className="text-[#0B6E99] ml-3 shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., tracking, prescription, refunds, lab sample)..."
                className="w-full px-3 py-2 text-[15px] text-[#07172E] placeholder-slate-400 bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[13px] text-white/80 mt-3">
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Self-Service Action Cards */}
      <section className="w-full -mt-8 relative z-20">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${action.accent}`}>
                      <Icon size={22} weight="bold" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#07172E] group-hover:text-[#0B6E99] transition-colors mb-1">
                      {action.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[13px] font-bold text-[#0B6E99]">
                    <span>{action.cta}</span>
                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Category Pills & Content */}
      <section className="py-16 md:py-24">
        <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8">
          {/* Category Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-[#0B6E99] text-white shadow-sm shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} weight={isSelected ? "fill" : "bold"} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Question size={32} />
                </div>
                <h3 className="text-[18px] font-bold text-[#07172E] mb-1">
                  No matching topics found
                </h3>
                <p className="text-[14px] text-slate-500 mb-6 max-w-sm mx-auto">
                  We couldn't find an answer for "{searchQuery}". Our support team is available 24/7 to help you.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Clear Search
                  </button>
                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-[#0B6E99] hover:bg-[#073B4C] transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all hover:border-[#0B6E99]/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[16px] font-bold text-[#07172E]">
                        {faq.q}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 bg-blue-50 text-[#0B6E99]" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <CaretDown size={16} weight="bold" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-[14px] leading-relaxed text-slate-600 border-t border-slate-100 animate-in fade-in-50 duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help / Support Channels Banner */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-br from-[#073B4C] to-[#0B6E99] rounded-3xl p-8 md:p-12 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[12px] font-bold text-[#7DD3C7] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  24/7 Dedicated Support
                </span>
                <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight mt-4 mb-3">
                  Still have questions? We're right here.
                </h2>
                <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed max-w-xl">
                  Our customer care and clinical pharmacist support teams are available round the clock to assist with your orders, prescriptions, or consultations.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/contact"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white text-[#07172E] font-bold text-[14px] hover:bg-teal-50 transition-all shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B6E99] flex items-center justify-center shrink-0">
                    <ChatCircle size={20} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#07172E]">Send a Message</p>
                    <p className="text-[12px] text-slate-500 font-normal">Average response &lt; 15 mins</p>
                  </div>
                  <ArrowRight size={16} weight="bold" className="text-slate-400 group-hover:text-[#0B6E99] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="mailto:support@medzoos.pk"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[14px] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
                    <Envelope size={20} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-white">Email Us</p>
                    <p className="text-[12px] text-white/70 font-normal">support@medzoos.pk</p>
                  </div>
                  <ArrowRight size={16} weight="bold" className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="tel:+923001234567"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[14px] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
                    <Phone size={20} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-white">Call Helpline</p>
                    <p className="text-[12px] text-white/70 font-normal">+92 300 123 4567</p>
                  </div>
                  <ArrowRight size={16} weight="bold" className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
