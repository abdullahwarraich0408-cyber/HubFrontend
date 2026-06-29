"use client";

import { useRef } from "react";
import {
  Pill,
  Stethoscope,
  Flask,
  Star,
  Baby,
  Drop,
  HairDryer,
  CircleHalf,
  Jar,
  HandSoap,
  ArrowRight,
  CaretRight,
  SquaresFour,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "../components/HeroSlider";
import { PrescriptionSection } from "../components/PrescriptionSection";
import { AppDownloadBanner } from "../components/AppDownloadBanner";
import { TrustBar } from "@/shared/layout/TrustBar";
import { useVendors, useDoctors, usePopularLabTests } from "@/lib/hooks/useApi";

const PROMO_BANNERS = [
  {
    title: "Flat 25% OFF",
    subtitle: "On Medicines",
    code: "Use Code: HEALTH25",
    cta: "Shop Now",
    href: "/browse",
    bg: "bg-[#E8F8F0]",
    titleColor: "text-[#1B5E20]",
    btnClass: "bg-[#0B6E72] hover:bg-[#084F52]",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "Consult Top Doctors",
    subtitle: "From the comfort of your home",
    code: null,
    cta: "Book Now",
    href: "/doctors",
    bg: "bg-[#E3F2FD]",
    titleColor: "text-[#0D47A1]",
    btnClass: "bg-[#1565C0] hover:bg-[#0D47A1]",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "Lab Tests at Home",
    subtitle: "Accurate • Fast • Reliable",
    code: null,
    cta: "Book Now",
    href: "/lab-tests",
    bg: "bg-[#F3E5F5]",
    titleColor: "text-[#6A1B9A]",
    btnClass: "bg-[#7B1FA2] hover:bg-[#6A1B9A]",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400",
  },
];

const CATEGORIES = [
  { name: "OTC", icon: Pill, href: "/browse?category=otc", circle: "bg-[#DDF3F4]", color: "text-[#0B6E72]" },
  { name: "Vitamins", icon: CircleHalf, href: "/browse?category=vitamins", circle: "bg-[#FFECCC]", color: "text-[#E65100]" },
  { name: "Diabetes", icon: Drop, href: "/browse?category=diabetes", circle: "bg-[#D6EAFD]", color: "text-[#1565C0]" },
  { name: "Baby Care", icon: Baby, href: "/browse?category=baby-care", circle: "bg-[#FADCE8]", color: "text-[#C2185B]" },
  { name: "Skin Care", icon: Jar, href: "/browse?category=skin-care", circle: "bg-[#D6EAFD]", color: "text-[#0288D1]" },
  { name: "Hair Care", icon: HairDryer, href: "/browse?category=hair-care", circle: "bg-[#FFF3CD]", color: "text-[#F57C00]" },
  { name: "Health Devices", icon: Stethoscope, href: "/browse?category=health-devices", circle: "bg-[#DDF5E4]", color: "text-[#2E7D32]" },
  { name: "Personal Care", icon: HandSoap, href: "/browse?category=personal-care", circle: "bg-[#EDE7F6]", color: "text-[#7B1FA2]" },
];

const NEARBY_PHARMACIES = [
  { slug: "city-pharmacy", name: "City Pharmacy", rating: 4.8, reviews: 230, time: "30 mins", distance: "1.2 km", minOrder: "PKR 500", open: true, bgImage: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=500" },
  { slug: "healthplus-pharmacy", name: "HealthPlus Pharmacy", rating: 4.9, reviews: 412, time: "20 mins", distance: "0.8 km", minOrder: "PKR 500", open: true, bgImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=500" },
  { slug: "medicare-direct", name: "MedPlus", rating: 4.7, reviews: 185, time: "25 mins", distance: "2.1 km", minOrder: "PKR 400", open: true, bgImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=500" },
  { slug: "pharmacare-24-7", name: "Care Pharmacy", rating: 4.9, reviews: 320, time: "15 mins", distance: "3.4 km", minOrder: "PKR 500", open: true, bgImage: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=500" },
];

const FEATURED_DOCTORS = [
  { id: "1", name: "Dr. Ayesha Khan", specialty: "Cardiologist", rating: 4.9, reviews: 420, consultations: "2.5k", fee: 1500, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400" },
  { id: "2", name: "Dr. Hassan Ali", specialty: "General Physician", rating: 4.8, reviews: 189, consultations: "1.8k", fee: 1200, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" },
  { id: "3", name: "Dr. Sara Ahmed", specialty: "Dermatologist", rating: 4.9, reviews: 312, consultations: "3.2k", fee: 2000, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400" },
  { id: "4", name: "Dr. Omar Farooq", specialty: "Pediatrician", rating: 4.7, reviews: 156, consultations: "980", fee: 1800, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400" },
];

const LAB_PACKAGES = [
  { name: "Complete Health Checkup", tests: ["CBC", "LFT", "KFT", "Lipid Profile", "Thyroid"], price: "PKR 4,999", discount: "30% OFF" },
  { name: "Diabetes Care Panel", tests: ["Fasting Sugar", "HbA1c", "Insulin"], price: "PKR 1,299", discount: "20% OFF" },
  { name: "Women's Wellness", tests: ["CBC", "Thyroid", "Vitamin D", "Iron"], price: "PKR 2,499", discount: null },
  { name: "Heart Health Panel", tests: ["ECG Report", "Lipid Profile", "CRP"], price: "PKR 3,499", discount: "15% OFF" },
];

function formatConsultations(reviews) {
  const count = Math.max(reviews * 6, 100);
  if (count >= 1000) {
    const value = count / 1000;
    return `${Number.isInteger(value) ? value : value.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

function formatDisplayDistance(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    const rounded = Math.round(value * 10) / 10;
    return `${rounded} km`;
  }
  const match = String(value).match(/([\d.]+)/);
  if (match) {
    const rounded = Math.round(parseFloat(match[1]) * 10) / 10;
    return `${rounded} km`;
  }
  return String(value);
}

function PharmacyCard({ pharmacy }) {
  const href = pharmacy.slug ? `/pharmacies/${pharmacy.slug}` : "/vendors";

  return (
    <Link
      href={href}
      className="snap-card shrink-0 w-[240px] md:w-[260px] flex flex-col bg-white border border-[var(--color-neutral-200)] rounded-[12px] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-brand-primary)]/20 transition-all group"
    >
      <div className="relative h-[140px] shrink-0 overflow-hidden rounded-t-[12px] bg-[var(--color-neutral-100)]">
        <Image
          src={pharmacy.bgImage}
          alt={pharmacy.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="260px"
        />
        <span
          className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold shadow-sm ${
            pharmacy.open ? "text-[var(--color-status-success)]" : "text-[var(--color-neutral-500)]"
          }`}
        >
          {pharmacy.open ? "Open" : "Closed"}
        </span>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] truncate leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors">
            {pharmacy.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={13} weight="fill" className="text-[var(--color-rating)]" />
            <span className="text-[12px] font-bold text-[var(--color-neutral-800)]">{pharmacy.rating}</span>
            <span className="text-[12px] text-[var(--color-neutral-500)]">({pharmacy.reviews})</span>
          </div>
        </div>

        <p className="text-[11px] text-[var(--color-neutral-500)] truncate">
          Delivery: {pharmacy.time} • {pharmacy.distance}
        </p>
        <p className="text-[11px] text-[var(--color-neutral-500)] truncate mt-0.5">
          Minimum Order: {pharmacy.minOrder}
        </p>

        <span className="mt-3 block w-full h-9 leading-9 text-center rounded-[8px] border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] text-[12px] font-bold group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors">
          View Store
        </span>
      </div>
    </Link>
  );
}

function FeaturedDoctorCard({ doctor }) {
  const href = doctor.id ? `/doctors/${doctor.id}?tab=book` : "/doctors";

  return (
    <Link
      href={href}
      className="group flex gap-3 p-4 h-full min-h-[196px] bg-white border border-[var(--color-neutral-200)] rounded-[12px] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-brand-primary)]/20 transition-all"
    >
      <div className="relative w-[88px] h-[88px] shrink-0 rounded-[10px] overflow-hidden bg-[#F5F7F9]">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="88px"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] truncate leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors">
          {doctor.name}
        </h3>
        <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5 truncate">{doctor.specialty}</p>

        <div className="flex items-center gap-1 mt-1.5">
          <Star size={13} weight="fill" className="text-[var(--color-rating)] shrink-0" />
          <span className="text-[12px] font-bold text-[var(--color-ink-headline)]">{doctor.rating}</span>
          <span className="text-[12px] text-[var(--color-neutral-500)]">({doctor.reviews})</span>
        </div>

        <p className="text-[11px] text-[var(--color-neutral-500)] mt-1">
          {doctor.consultations} Consultations
        </p>

        <p className="text-[13px] font-bold text-[var(--color-ink-headline)] mt-1">
          PKR {doctor.fee.toLocaleString()}
        </p>

        <div className="mt-auto pt-2 flex justify-end">
          <span className="inline-flex items-center justify-center h-[32px] px-4 rounded-[8px] bg-[var(--color-brand-primary)] text-white text-[12px] font-bold group-hover:bg-[var(--color-brand-dark)] transition-colors">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
}

function CategoryItem({ name, href, icon: Icon, circle, color, isViewAll = false }) {
  return (
    <Link href={href} className="flex flex-col items-center w-full min-w-[72px] max-lg:shrink-0 group">
      <div className="w-[80px] h-[80px] rounded-[12px] bg-[#F5F7F9] flex items-center justify-center mb-2 group-hover:bg-[#EEF2F5] transition-colors">
        <div
          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${
            isViewAll ? "bg-[#ECEFF1]" : circle
          }`}
        >
          <Icon
            size={isViewAll ? 22 : 24}
            className={isViewAll ? "text-[#90A4AE]" : color}
            weight="fill"
          />
        </div>
      </div>
      <span className="text-[12px] text-[#616161] text-center font-normal leading-tight">
        {name}
      </span>
    </Link>
  );
}

function SectionHeader({ title, href, linkLabel = "View All" }) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-5">
      <h2 className="text-[18px] md:text-[20px] font-bold text-[var(--color-ink-headline)]">{title}</h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand-primary)] hover:gap-1.5 transition-all">
          {linkLabel} <ArrowRight size={14} weight="bold" />
        </Link>
      )}
    </div>
  );
}

export function HomePage() {
  const pharmacyScrollRef = useRef(null);
  const { data: apiPharmacies = [] } = useVendors();
  const { data: apiDoctors = [] } = useDoctors();
  const { data: apiLabPackages = [] } = usePopularLabTests();

  const nearbyPharmacies =
    apiPharmacies.length > 0
      ? apiPharmacies.slice(0, 4).map((vendor, i) => ({
          slug: vendor.slug || NEARBY_PHARMACIES[i]?.slug,
          name: vendor.name,
          rating: vendor.rating,
          reviews: NEARBY_PHARMACIES[i]?.reviews ?? 200,
          time: (() => {
            const raw = vendor.deliveryTime?.split("–")[0]?.trim();
            if (!raw) return NEARBY_PHARMACIES[i]?.time || "30 mins";
            return raw.includes("min") ? raw : `${raw} mins`;
          })(),
          distance:
            formatDisplayDistance(vendor.distanceKm ?? vendor.distance) ||
            NEARBY_PHARMACIES[i]?.distance ||
            "1.2 km",
          minOrder: "PKR 500",
          open: vendor.status !== "closed",
          bgImage: vendor.bgImage,
        }))
      : NEARBY_PHARMACIES;

  const featuredDoctors =
    apiDoctors.length > 0
      ? apiDoctors.slice(0, 4).map((doctor, i) => {
          const fallback = FEATURED_DOCTORS[i] || FEATURED_DOCTORS[0];
          const reviews = doctor.reviews ?? fallback.reviews;
          return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            rating: doctor.rating,
            reviews,
            consultations: formatConsultations(reviews),
            fee: doctor.fee ?? fallback.fee,
            image: doctor.photo || doctor.image || fallback.image,
          };
        })
      : FEATURED_DOCTORS;

  const labPackages =
    apiLabPackages.length > 0
      ? apiLabPackages.slice(0, 4).map((pkg) => ({
          name: pkg.name,
          tests: [`${pkg.testsIncluded} tests included`],
          price: `PKR ${pkg.price.toLocaleString()}`,
          discount: pkg.discount,
        }))
      : LAB_PACKAGES;

  const scrollPharmacies = () => {
    pharmacyScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col bg-[#FAFBFC]">
      <HeroSlider />

      <div className="w-full home-container mx-auto py-6 md:py-8 space-y-8 md:space-y-10">

        {/* Promotional Banners */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROMO_BANNERS.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className={`group relative rounded-[12px] overflow-hidden ${banner.bg} border border-white/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[160px] flex`}
            >
              <div className="flex flex-col justify-center p-5 md:p-6 flex-1 z-10">
                <h3 className={`text-[17px] md:text-[19px] font-bold ${banner.titleColor} leading-tight`}>{banner.title}</h3>
                <p className="text-[13px] text-[var(--color-neutral-600)] mt-0.5 mb-1">{banner.subtitle}</p>
                {banner.code && (
                  <p className="text-[12px] font-semibold text-[var(--color-neutral-700)] mb-4">{banner.code}</p>
                )}
                {!banner.code && <div className="mb-4" />}
                <span className={`inline-flex items-center justify-center self-start h-[36px] px-5 rounded-[8px] text-white text-[12px] font-bold transition-colors ${banner.btnClass}`}>
                  {banner.cta}
                </span>
              </div>
              <div className="relative w-[120px] md:w-[140px] shrink-0 self-stretch min-h-[160px]">
                <Image src={banner.image} alt={banner.title} fill className="object-cover object-center" sizes="140px" />
              </div>
            </Link>
          ))}
        </section>

        {/* Shop by Category */}
        <section>
          <SectionHeader title="Shop by Category" href="/browse" />
          <div className="grid grid-cols-9 max-lg:flex max-lg:overflow-x-auto max-lg:gap-3 max-lg:pb-1 scrollbar-hide w-full">
            {CATEGORIES.map((cat) => (
              <CategoryItem key={cat.name} {...cat} />
            ))}
            <CategoryItem name="View All" href="/browse" icon={SquaresFour} isViewAll />
          </div>
        </section>

        {/* Nearby Pharmacies */}
        <section>
          <SectionHeader title="Nearby Pharmacies" href="/vendors" />
          <div className="relative">
            <div ref={pharmacyScrollRef} className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory pr-12">
              {nearbyPharmacies.map((pharmacy) => (
                <PharmacyCard key={pharmacy.name} pharmacy={pharmacy} />
              ))}
            </div>
            <button
              type="button"
              onClick={scrollPharmacies}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-200)] shadow-md items-center justify-center text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)] transition-colors z-10"
              aria-label="Scroll pharmacies"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </section>

        {/* Featured Doctors */}
        <section>
          <SectionHeader title="Featured Doctors" href="/doctors" linkLabel="View All Doctors" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {featuredDoctors.map((doctor) => (
              <FeaturedDoctorCard key={doctor.id || doctor.name} doctor={doctor} />
            ))}
          </div>
        </section>

        {/* Popular Lab Packages */}
        <section>
          <SectionHeader title="Popular Lab Packages" href="/lab-tests" linkLabel="View All Packages" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {labPackages.map((pkg) => (
              <Link key={pkg.name} href="/lab-tests" className="bg-white border border-[var(--color-neutral-200)] rounded-[12px] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col h-full group relative">
                {pkg.discount && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-[var(--color-status-danger)] px-2 py-0.5 rounded-full">{pkg.discount}</span>
                )}
                <div className="w-10 h-10 rounded-[10px] bg-[var(--color-brand-mist)] flex items-center justify-center mb-3">
                  <Flask size={20} className="text-[var(--color-brand-primary)]" weight="bold" />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)] mb-2 pr-10">{pkg.name}</h3>
                <ul className="text-[12px] text-[var(--color-neutral-500)] space-y-1 mb-4 flex-1">
                  {(Array.isArray(pkg.tests) ? pkg.tests : [pkg.tests]).slice(0, 4).map((test) => (
                    <li key={test} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      {test}
                    </li>
                  ))}
                </ul>
                <p className="text-[17px] font-bold text-[var(--color-brand-primary)] mb-3">{pkg.price}</p>
                <span className="block w-full text-center h-[36px] leading-[36px] rounded-[8px] border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] text-[12px] font-bold group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors">
                  Book Now
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Upload Prescription + How it Works + Stats */}
        <PrescriptionSection />

        {/* App Download Banner */}
        <AppDownloadBanner />

      </div>

      <TrustBar />
    </div>
  );
}
