function formatDateTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapPrescriptionOrderItem(item) {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    availability: item.availability,
  };
}

function mapAssignmentLog(log) {
  return {
    id: log.id,
    vendorId: log.vendor_id,
    vendorName: log.vendor?.business_name || "Unknown pharmacy",
    action: log.action,
    actionLabel: ASSIGNMENT_ACTION_LABELS[log.action] || log.action,
    score: log.score,
    createdAt: log.created_at,
    time: formatDateTime(log.created_at),
  };
}

export const ASSIGNMENT_ACTION_LABELS = {
  offered: "Offer sent",
  accepted: "Accepted",
  declined: "Declined",
  timeout: "Timed out (no response)",
};

export const PRESCRIPTION_STATUS_LABELS = {
  finding_vendor: "Finding pharmacy",
  awaiting_accept: "Waiting for pharmacy",
  accepted: "Pharmacy accepted",
  stock_pending: "Checking stock",
  stock_confirmed: "Stock confirmed",
  customer_review: "Review required",
  confirmed: "Confirmed",
  packed: "Packed",
  rider_assigned: "Rider assigned",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  no_vendor: "No pharmacy available",
};

export function mapPrescriptionOrderToFrontend(order) {
  if (!order) return null;

  const items = (order.items || []).map(mapPrescriptionOrderItem);
  const assignmentHistory = (order.assignment_logs || []).map(mapAssignmentLog);

  return {
    id: order.id,
    shortId: `#P${String(order.id).slice(0, 6).toUpperCase()}`,
    fileUrl: order.file_url,
    status: order.status,
    statusLabel: PRESCRIPTION_STATUS_LABELS[order.status] || order.status,
    estimatedValue: order.estimated_value,
    medicineCount: order.medicine_count || order.items?.length || 0,
    distanceKm: order.distance_km,
    etaMinutes: order.eta_minutes,
    acceptDeadline: order.accept_deadline,
    createdAt: order.created_at,
    createdAtLabel: formatDateTime(order.created_at),
    items,
    assignmentHistory,
    assignmentAttempts: order.assignment_attempts || assignmentHistory.length,
    customer: order.customer
      ? { id: order.customer.id, name: order.customer.name, email: order.customer.email }
      : null,
    currentVendor: order.current_vendor
      ? { id: order.current_vendor.id, name: order.current_vendor.business_name }
      : null,
    assignedVendor: order.assigned_vendor
      ? { id: order.assigned_vendor.id, name: order.assigned_vendor.business_name }
      : null,
  };
}

export function mapPrescriptionOrdersToFrontend(orders = []) {
  return orders.map(mapPrescriptionOrderToFrontend).filter(Boolean);
}
