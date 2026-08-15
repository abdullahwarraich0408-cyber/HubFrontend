export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop";

export function mapProductToMedicine(product) {
  if (!product) return null;

  const discountRaw = product.discount;
  const discount =
    discountRaw != null && Number(discountRaw) > 0 ? Number(discountRaw) : null;

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
    image: product.image_url || DEFAULT_PRODUCT_IMAGE,
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
