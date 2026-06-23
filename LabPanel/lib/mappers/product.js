export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop";

export function mapProductToMedicine(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    generic: product.formula || product.name,
    brand: product.category || "Generic",
    vendor: product.vendor?.business_name || "Verified Pharmacy",
    category: product.category || "OTC",
    prescriptionRequired: Boolean(product.requires_prescription),
    price: product.price,
    stock: product.stock ?? 0,
    deliveryEta: "Same day",
    image: product.image_url || DEFAULT_PRODUCT_IMAGE,
    rating: product.rating ?? 4.5,
    reviews: product.reviews_count ?? 0,
    description: product.description,
    vendorId: product.vendor_id,
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
