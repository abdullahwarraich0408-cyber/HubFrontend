"use client";

import { MapPin, Phone, Envelope, CaretRight, Storefront, Handshake } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function ContactPage() {
  return (
    <div className="w-full flex flex-col bg-[var(--color-surface-subtle)] min-h-screen">
      {/* Header */}
      <section className="bg-[var(--color-brand-primary)] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#FFFFFF_0%,_transparent_50%)] opacity-10"></div>
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px] text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-bold tracking-widest uppercase mb-6 border border-white/30">
            Get in touch
          </div>
          <h1 className="text-[48px] md:text-[64px] font-[var(--font-heading)] font-bold text-white mb-6 leading-tight">
            We're here to help.
          </h1>
          <p className="text-[18px] text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Whether you're a customer with an order issue, or a pharmacy looking to join our network, our team is ready to support you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 md:py-24 -mt-16 relative z-20">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Contact Info & Vendor Callout */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-8">
              {/* Contact Cards */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] flex flex-col gap-10">
                <div>
                  <h3 className="text-[28px] font-bold text-[var(--color-ink-headline)] mb-2 tracking-tight">Contact Information</h3>
                  <p className="text-[var(--color-neutral-500)] text-[16px]">Our support team is available 24/7 to assist you.</p>
                </div>
                
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Envelope size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-1">Email Us</h4>
                      <p className="text-[14px] text-[var(--color-neutral-500)] mb-1.5">For general inquiries and support.</p>
                      <a href="mailto:support@pharmahub.pk" className="text-[15px] font-bold text-[var(--color-brand-primary)] hover:underline">support@pharmahub.pk</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-1">Call Us</h4>
                      <p className="text-[14px] text-[var(--color-neutral-500)] mb-1.5">Mon-Fri from 9am to 6pm.</p>
                      <a href="tel:+923001234567" className="text-[15px] font-bold text-[var(--color-brand-primary)] hover:underline">+92 300 123 4567</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-1">Office</h4>
                      <p className="text-[15px] text-[var(--color-neutral-500)] leading-relaxed">
                        DHA Phase 6, Karachi<br />
                        Sindh, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Become a Vendor Callout */}
              <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-[32px] p-8 md:p-10 shadow-2xl flex flex-col items-start relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-brand-primary)]/20 rounded-full blur-[60px]"></div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/20 shadow-inner">
                  <Storefront size={28} className="text-white" weight="fill" />
                </div>
                <h3 className="text-[28px] font-bold text-white mb-3 tracking-tight">Become a Partner</h3>
                <p className="text-white/70 text-[16px] mb-8 leading-relaxed">
                  Join hundreds of verified pharmacies expanding their reach through PharmaHub's digital network.
                </p>
                <Button className="bg-white text-ink-900 hover:bg-neutral-100 font-bold rounded-xl w-full h-14 text-[16px]">
                  Partner Application <CaretRight size={20} className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="col-span-1 lg:col-span-7">
              <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] h-full">
                <h3 className="text-[32px] font-bold text-[var(--color-ink-headline)] mb-2 tracking-tight">Send us a message</h3>
                <p className="text-[var(--color-neutral-500)] text-[16px] mb-10">We usually respond within 24 hours.</p>

                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-[var(--color-ink-headline)]">First Name</label>
                      <Input placeholder="John" className="h-14 bg-[var(--color-surface-subtle)] border-transparent hover:border-[var(--color-neutral-300)] focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-[var(--color-ink-headline)]">Last Name</label>
                      <Input placeholder="Doe" className="h-14 bg-[var(--color-surface-subtle)] border-transparent hover:border-[var(--color-neutral-300)] focus:bg-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-[var(--color-ink-headline)]">Email Address</label>
                    <Input type="email" placeholder="john@company.com" className="h-14 bg-[var(--color-surface-subtle)] border-transparent hover:border-[var(--color-neutral-300)] focus:bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-[var(--color-ink-headline)]">Inquiry Type</label>
                    <select className="h-14 rounded-xl border border-transparent bg-[var(--color-surface-subtle)] hover:border-[var(--color-neutral-300)] px-4 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all">
                      <option>General Support</option>
                      <option>Order Issue</option>
                      <option>Vendor Application (Become a Partner)</option>
                      <option>Business Development</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-[var(--color-ink-headline)]">Message</label>
                    <textarea 
                      placeholder="How can we help you?" 
                      className="min-h-[200px] rounded-xl border border-transparent bg-[var(--color-surface-subtle)] hover:border-[var(--color-neutral-300)] p-4 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all resize-y"
                    ></textarea>
                  </div>

                  <Button className="h-14 bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-dark)] text-[16px] font-bold rounded-xl mt-6 shadow-xl shadow-[var(--color-brand-primary)]/20 w-full md:w-auto md:px-10 self-start">
                    Send Message <Handshake size={24} className="ml-2" />
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
