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
  const isOperational =
    vendor.availability?.isAvailable ??
    (vendor.status === "approved" || vendor.status === "active");
  const isOpen =
    vendor.availability?.openAllowed ??
    vendor.is_open ??
    isOperational;

  return {
    id: vendor.id,
    slug,
    name,
    desc: vendor.description || null,
    shortDesc: vendor.short_desc || null,
    products: vendor.product_count ?? vendor.products ?? 0,
    rating: vendor.rating != null ? Number(vendor.rating) : null,
    reviews: vendor.reviews_count ?? 0,
    deliveryTime: vendor.delivery_time || null,
    deliveryMin: vendor.delivery_min ?? null,
    status: isOpen ? "open" : "closed",
    verified: isOperational,
    distanceKm: vendor.distance_km != null ? Number(vendor.distance_km) : null,
    distance: formatDistanceKm(vendor.distance_km ?? vendor.distance),
    tags: vendor.tags || (isOperational ? ["Verified"] : []),
    bgImage: vendor.bg_image || vendor.image_url || DEFAULT_VENDOR_IMAGE,
    initials: name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    open24: Boolean(vendor.open_24),
    fast: Boolean(vendor.fast_delivery),
    featured: Boolean(vendor.featured),
    lowestPrice: Boolean(vendor.lowest_price),
    prescriptionRequired: Boolean(vendor.prescription_required),
    stockAvailable: vendor.stock_available !== false,
    services: vendor.services || { medicines: true, doctors: false, labTests: false },
    pricing: vendor.pricing || null,
    compare: vendor.compare || null,
    about: vendor.about || vendor.description || null,
    address: vendor.address || null,
    phone: vendor.phone || "",
    minOrder: vendor.min_order ?? null,
    orders: vendor.orders_count ?? null,
  };
}

export function mapVendorsToPharmacies(vendors = []) {
  return vendors.map(mapVendorToPharmacy).filter(Boolean);
}
