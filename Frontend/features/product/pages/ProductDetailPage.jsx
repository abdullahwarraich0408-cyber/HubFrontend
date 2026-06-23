"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  CaretRight,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Truck,
  Clock,
  Star,
  Scales,
  User,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { MedicineCard } from "@/features/medicines/components/MedicineCard";
import {
  getMedicineById,
  getSimilarMedicines,
  MOCK_ALTERNATIVES,
  MOCK_REVIEWS,
} from "@/features/medicines/data/mockMedicines";
import { useProduct, useProducts, useProductReviews } from "@/lib/hooks/useApi";
import { api } from "@/lib/api";

const DETAIL_TABS = [
  { id: "product", label: "Product" },
  { id: "alternatives", label: "Alternatives" },
  { id: "usage", label: "Usage" },
  { id: "sideEffects", label: "Side Effects" },
  { id: "reviews", label: "Reviews" },
  { id: "similar", label: "Similar Medicines" },
];

const PRODUCT_DETAILS = {
  description:
    "Clinically proven formula for fast relief. Sourced from authorized distributors and stored under recommended conditions.",
  usage:
    "Adults and children aged 12 years and over: Take as directed by your physician or as per package instructions. Do not exceed the recommended daily dose. Take with a full glass of water.",
  sideEffects:
    "When taken as recommended, this medicine is usually well tolerated. Mild nausea, dizziness, or skin reactions may occur in rare cases. Discontinue use and consult a doctor if adverse effects persist.",
  composition: "Active ingredients as listed on the package. Excipients may include starch, lactose, and magnesium stearate.",
  storage: "Store below 30°C in a dry place. Keep out of reach of children.",
  manufacturer: "Licensed pharmaceutical manufacturer — batch verified.",
};

export function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { data: apiProduct, isLoading } = useProduct(params.id);
  const { data: allProducts = [] } = useProducts();
  const { data: apiReviews = [] } = useProductReviews(params.id);
  const [isAdding, setIsAdding] = useState(false);

  const mockProduct = getMedicineById(params.id);
  const product = apiProduct || mockProduct;
  const similar = apiProduct
    ? allProducts.filter((item) => item.id !== params.id && item.category === apiProduct.category).slice(0, 4)
    : getSimilarMedicines(params.id);
  const reviews = apiReviews.length > 0 ? apiReviews : MOCK_REVIEWS;

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("product");

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-subtle)] py-20 text-center">
        <p className="text-[var(--color-neutral-500)]">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-subtle)] py-20 text-center">
        <p className="text-[var(--color-neutral-500)] mb-4">Product not found</p>
        <Button onClick={() => router.push("/browse")}>Browse Medicines</Button>
      </div>
    );
  }

  const images = [product.image, product.image, product.image];
  const outOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        await api.cart.add(product.id, quantity);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existingIdx = guestCart.findIndex(item => item.id === product.id);
        if (existingIdx > -1) {
          guestCart[existingIdx].quantity += quantity;
        } else {
          guestCart.push({
            id: product.id,
            name: product.name,
            vendor: product.vendor,
            price: product.price,
            quantity: quantity,
            image: product.image,
            inStock: true,
          });
        }
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart-updated'));
        }
      }
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "alternatives":
        return (
          <div className="space-y-3">
            {MOCK_ALTERNATIVES.map((alt) => (
              <div
                key={alt.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[12px] border border-[var(--color-neutral-200)]"
              >
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">{alt.name}</p>
                  <p className="text-[12px] text-[var(--color-neutral-500)]">{alt.generic} · {alt.vendor}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-[var(--color-status-success)] bg-[var(--color-status-success-bg)] px-2 py-1 rounded-full">
                    {alt.savings}
                  </span>
                  <span className="text-[16px] font-bold text-[var(--color-brand-primary)]">PKR {alt.price}</span>
                  <Button variant="secondary" className="h-[36px] text-[12px] px-4">Switch</Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "usage":
        return (
          <div className="prose-sm text-[14px] leading-relaxed text-[var(--color-neutral-600)] space-y-4">
            <p>{PRODUCT_DETAILS.usage}</p>
            <div className="p-4 bg-[var(--color-brand-mist)] rounded-[12px] border border-[var(--color-brand-light)]">
              <p className="text-[13px] font-semibold text-[var(--color-brand-primary)]">
                Always follow your doctor&apos;s prescription and read the leaflet before use.
              </p>
            </div>
          </div>
        );

      case "sideEffects":
        return (
          <div className="text-[14px] leading-relaxed text-[var(--color-neutral-600)] space-y-4">
            <p>{PRODUCT_DETAILS.sideEffects}</p>
            <ul className="list-disc pl-5 space-y-1 text-[13px]">
              <li>Allergic reactions (rare)</li>
              <li>Gastrointestinal discomfort</li>
              <li>Drowsiness or dizziness</li>
            </ul>
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
              <div className="text-center">
                <p className="text-[32px] font-bold text-[var(--color-ink-headline)]">{product.rating}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} weight="fill" className="text-[var(--color-rating)]" />
                  ))}
                </div>
                <p className="text-[12px] text-[var(--color-neutral-500)] mt-1">{product.reviews} reviews</p>
              </div>
            </div>
            {reviews.map((review) => (
              <div key={review.id || review.author} className="p-4 border border-[var(--color-neutral-200)] rounded-[12px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center">
                      <User size={16} className="text-[var(--color-brand-primary)]" />
                    </div>
                    <span className="text-[13px] font-bold text-[var(--color-ink-headline)]">
                      {review.customer?.name || review.author || "Customer"}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--color-neutral-400)]">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : review.date}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={12} weight="fill" className="text-[var(--color-rating)]" />
                  ))}
                </div>
                <p className="text-[13px] text-[var(--color-neutral-600)] leading-relaxed">
                  {review.comment || review.text}
                </p>
              </div>
            ))}
          </div>
        );

      case "similar":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similar.map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-5 text-[14px] leading-relaxed text-[var(--color-neutral-600)]">
            <p>{PRODUCT_DETAILS.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Composition", value: PRODUCT_DETAILS.composition },
                { label: "Storage", value: PRODUCT_DETAILS.storage },
                { label: "Manufacturer", value: PRODUCT_DETAILS.manufacturer },
                { label: "Brand", value: product.brand },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-neutral-400)] mb-1">{item.label}</p>
                  <p className="text-[13px] font-medium text-[var(--color-ink-headline)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--color-neutral-500)] mb-6">
          <Link href="/" className="hover:text-[var(--color-brand-primary)]">Home</Link>
          <CaretRight size={12} weight="bold" />
          <Link href="/browse" className="hover:text-[var(--color-brand-primary)]">Medicines</Link>
          <CaretRight size={12} weight="bold" />
          <span className="text-[var(--color-ink-headline)] truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product hero */}
        <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-[42%]">
              <div className="relative aspect-square rounded-[16px] overflow-hidden bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] mb-3">
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                {product.prescriptionRequired && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-[var(--color-ink-900)] text-white text-[11px] font-bold uppercase rounded-md">Rx Required</span>
                )}
              </div>
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-[10px] overflow-hidden border-2 ${activeImage === idx ? "border-[var(--color-brand-primary)]" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-brand-primary)] mb-2">{product.category}</p>
              <h1 className="text-[26px] md:text-[32px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-[15px] text-[var(--color-neutral-500)] italic mb-4">{product.generic}</p>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-[13px]">
                <Link href="/vendors" className="flex items-center gap-1.5 font-semibold text-[var(--color-brand-primary)] hover:underline">
                  <ShieldCheck size={16} weight="fill" className="text-[var(--color-status-success)]" />
                  {product.vendor}
                </Link>
                <div className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-[var(--color-rating)]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[var(--color-neutral-400)]">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="text-[32px] font-bold text-[var(--color-brand-primary)] mb-4">
                PKR {product.price.toLocaleString()}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${outOfStock ? "bg-[var(--color-status-danger)]" : "bg-[var(--color-status-success)]"}`} />
                  <span className="text-[13px] font-semibold">{outOfStock ? "Out of Stock" : `${product.stock} in stock`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand-primary)]">
                  <Clock size={16} weight="fill" />
                  Delivery: {product.deliveryEta}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-600)]">
                  <Truck size={16} />
                  Free over PKR 2,000
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center border-2 border-[var(--color-neutral-200)] rounded-[12px] h-[48px] w-full sm:w-[130px]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center">
                    <Minus size={14} weight="bold" />
                  </button>
                  <span className="flex-1 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-full flex items-center justify-center">
                    <Plus size={14} weight="bold" />
                  </button>
                </div>
                <Button className="flex-1 h-[48px]" disabled={outOfStock || isAdding} onClick={handleAddToCart}>
                  <ShoppingCart size={18} weight="fill" className="mr-2" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
                <Link href="/checkout" className="flex-1">
                  <Button variant="secondary" className="h-[48px] px-6 w-full" disabled={outOfStock}>
                    <CreditCard size={18} className="mr-2" />
                    Buy Now
                  </Button>
                </Link>
              </div>

              <button className="w-full sm:w-auto flex items-center justify-center gap-2 h-[40px] px-5 text-[13px] font-semibold text-[var(--color-brand-primary)] border border-[var(--color-brand-light)] rounded-[12px] hover:bg-[var(--color-brand-mist)] transition-colors">
                <Scales size={16} weight="bold" />
                Compare Prices Across Vendors
              </button>
            </div>
          </div>
        </div>

        {/* Detail tabs */}
        <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden">
          <div className="flex overflow-x-auto border-b border-[var(--color-neutral-200)] scrollbar-hide">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                    : "border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-ink-headline)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
