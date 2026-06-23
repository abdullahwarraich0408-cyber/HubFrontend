import { DEFAULT_PRODUCT_IMAGE } from "./product";

function formatOrderDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

function buildTracking(status, createdAt) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const dateLabel = formatOrderDate(createdAt);

  return [
    { step: "Order Placed", time: dateLabel, done: currentIndex >= 0 },
    { step: "Confirmed", time: dateLabel, done: currentIndex >= 1 },
    { step: "Packed", time: dateLabel, done: currentIndex >= 1 },
    { step: "Out for Delivery", time: dateLabel, done: currentIndex >= 2 },
    { step: "Delivered", time: status === "delivered" ? dateLabel : "Pending", done: currentIndex >= 3 },
  ];
}

export function mapOrderToFrontend(order) {
  if (!order) return null;

  const deliveryAddress =
    typeof order.delivery_address === "string"
      ? order.delivery_address
      : order.delivery_address?.street ||
        order.delivery_address?.address ||
        "Delivery address on file";

  return {
    id: order.id,
    type: "medicines",
    title: "Medicine Order",
    date: formatOrderDate(order.created_at),
    status: order.status,
    total: order.total_amount,
    vendor: order.vendor?.business_name || "Pharmacy",
    items:
      order.items?.map((item) => ({
        name: item.product?.name || item.name || "Product",
        qty: item.quantity,
        price: (item.unit_price ?? item.price ?? 0) * item.quantity,
        img: item.product?.image_url || DEFAULT_PRODUCT_IMAGE,
      })) || [],
    tracking: buildTracking(order.status, order.created_at),
    deliveryAddress,
    reorderHref: "/browse",
  };
}

export function mapOrdersToFrontend(orders = []) {
  return orders.map(mapOrderToFrontend).filter(Boolean);
}
