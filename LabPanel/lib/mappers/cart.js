import { DEFAULT_PRODUCT_IMAGE } from "./product";

export function mapCartItemToFrontend(item) {
  return {
    id: item.product_id || item.id,
    productId: item.product_id || item.id,
    name: item.name,
    vendor: item.vendor_name || "Pharmacy",
    price: item.price,
    quantity: item.quantity,
    image: item.image_url || DEFAULT_PRODUCT_IMAGE,
    inStock: item.in_stock !== false,
  };
}

export function mapCartToFrontend(cart) {
  if (!cart) {
    return { items: [], total: 0 };
  }

  return {
    items: (cart.items || []).map(mapCartItemToFrontend),
    total: cart.total ?? 0,
  };
}
