export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop";

const REAL_MEDICINE_IMAGE_MAP = {
  panadol: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
  augmentin: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop",
  amoxil: "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600&auto=format&fit=crop",
  arinac: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  brufen: "https://images.unsplash.com/photo-1550572017-edf792890581?q=80&w=600&auto=format&fit=crop",
  calpol: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop",
  centrum: "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=600&auto=format&fit=crop",
  surbex: "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=600&auto=format&fit=crop",
  betadine: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=600&auto=format&fit=crop",
  insulin: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600&auto=format&fit=crop",
  glucophage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
  glucose: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
  vitamin: "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=600&auto=format&fit=crop",
  disprin: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=600&auto=format&fit=crop",
  flagyl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  rigix: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop",
  softin: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop",
  ponstan: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  risek: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop",
  syrup: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop",
};

const DISTINCT_MEDICINE_IMAGE_VARIATIONS = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550572017-edf792890581?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600&auto=format&fit=crop",
];

export function resolveMedicineImage(product) {
  const nameLower = String(product?.name || "").toLowerCase();

  for (const [key, url] of Object.entries(REAL_MEDICINE_IMAGE_MAP)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }

  const rawUrl = product?.image_url || product?.image;
  if (
    rawUrl &&
    typeof rawUrl === "string" &&
    rawUrl.trim().length > 0 &&
    !rawUrl.includes("1584308666744-24d5c474f2ae") &&
    !rawUrl.includes("unsplash.com")
  ) {
    return rawUrl;
  }

  const str = String(product?.id || product?.name || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DISTINCT_MEDICINE_IMAGE_VARIATIONS.length;
  return DISTINCT_MEDICINE_IMAGE_VARIATIONS[index];
}

export function mapProductToMedicine(product) {
  if (!product) return null;

  const discountRaw = product.discount;
  const discount =
    discountRaw != null && Number(discountRaw) > 0 ? Number(discountRaw) : null;

  const image = resolveMedicineImage(product);

  return {
    id: product.id,
    name: product.name,
    generic: product.formula || product.name,
    brand: product.category || null,
    vendor:
      product.vendor?.business_name ||
      product.vendor?.name ||
      product.vendorName ||
      null,
    vendorId: product.vendor_id || product.vendor?.id || null,
    vendorSlug: product.vendor?.slug || null,
    category: product.category || "OTC",
    prescriptionRequired: Boolean(product.requires_prescription),
    price: product.price,
    discount,
    stock: product.stock ?? 0,
    deliveryEta: product.delivery_eta || product.delivery_time || null,
    image,
    rating: product.rating != null ? Number(product.rating) : null,
    reviews: product.reviews_count ?? 0,
    description: product.description,
  };
}

export function mapProductsToMedicines(products = []) {
  return products.map(mapProductToMedicine).filter(Boolean);
}

const STORE_CATEGORY_MAP = {
  Prescription: "prescription",
  OTC: "otc",
  Vitamins: "otc",
  Supplements: "personal-care",
  "Baby Care": "baby-care",
  "Personal Care": "personal-care",
};

export function mapProductToStoreProduct(product) {
  const medicine = mapProductToMedicine(product);
  if (!medicine) return null;

  return {
    id: medicine.id,
    name: medicine.name,
    pack: product.formula || product.description || "1 Unit",
    price: medicine.price,
    discount: product.discount ?? 0,
    image: medicine.image,
    category: STORE_CATEGORY_MAP[medicine.category] || "otc",
    inStock: medicine.stock > 0,
    stock: medicine.stock,
    vendor: medicine.vendor,
  };
}

export function mapProductsToStoreProducts(products = []) {
  return products.map(mapProductToStoreProduct).filter(Boolean);
}
