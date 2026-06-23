export const DEFAULT_VENDOR_IMAGE =
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800";

export function slugifyVendorName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDistanceKm(value) {
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

export function mapVendorToPharmacy(vendor, index = 0) {
  if (!vendor) return null;

  const name = vendor.business_name || vendor.name || "Pharmacy";
  const slug = vendor.slug || slugifyVendorName(name) || vendor.id;

  return {
    id: vendor.id,
    slug,
    name,
    desc: vendor.description || "Verified pharmacy partner on PharmaHub.",
    shortDesc: vendor.short_desc || "Authentic medicines & fast delivery",
    products: vendor.product_count ?? vendor.products ?? 0,
    rating: vendor.rating ?? 4.5,
    reviews: vendor.reviews_count ?? 0,
    deliveryTime: vendor.delivery_time || "30–45 min",
    deliveryMin: vendor.delivery_min ?? 30,
    status: vendor.status === "approved" ? "open" : "closed",
    verified: vendor.status === "approved",
    distanceKm: vendor.distance_km ?? (index + 1) * 1.2,
    distance: formatDistanceKm(vendor.distance_km ?? vendor.distance) || `${(index + 1) * 1.2} km`,
    tags: vendor.tags || ["Verified"],
    bgImage: vendor.bg_image || vendor.image_url || DEFAULT_VENDOR_IMAGE,
    initials: name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    open24: Boolean(vendor.open_24),
    fast: Boolean(vendor.fast_delivery ?? true),
    featured: Boolean(vendor.featured ?? index < 3),
    lowestPrice: Boolean(vendor.lowest_price),
    prescriptionRequired: true,
    stockAvailable: true,
    services: vendor.services || { medicines: true, doctors: false, labTests: false },
    pricing: vendor.pricing || "mid",
    compare: vendor.compare || { delivery: 8, pricing: 8, availability: 8 },
    about: vendor.about || `${name} is a verified PharmaHub partner.`,
    address: vendor.address || "Karachi, Pakistan",
    phone: vendor.phone || "",
  };
}

export function mapVendorsToPharmacies(vendors = []) {
  return vendors.map(mapVendorToPharmacy).filter(Boolean);
}
