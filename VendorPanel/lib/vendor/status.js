export const APPROVAL_LABELS = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
};

export const LISTING_LABELS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  OUT_OF_STOCK: "Out of Stock",
  ARCHIVED: "Archived",
};

export const ORDER_LABELS = {
  NEW: "New",
  pending: "New",
  ACCEPTED: "Accepted",
  processing: "Accepted",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  shipped: "Out for delivery",
  DELIVERED: "Delivered",
  delivered: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  cancelled: "Cancelled",
  REJECTED: "Rejected",
  RETURN_REQUESTED: "Return requested",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};

export const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Injection",
  "Drops",
  "Cream",
  "Gel",
  "Ointment",
  "Inhaler",
  "Powder",
  "Sachet",
  "Other",
];

export const ORDER_REJECTION_REASONS = [
  "Out of stock",
  "Unable to fulfill",
  "Pharmacy closed",
  "Prescription issue",
  "Pricing issue",
  "Other",
];

export const RX_REJECTION_REASONS = [
  "Prescription unclear",
  "Prescription expired",
  "Medicine unavailable",
  "Quantity issue",
  "Invalid prescription",
  "Needs doctor clarification",
  "Other",
];

export const STAFF_ROLES = ["MANAGER", "PHARMACIST", "INVENTORY_MANAGER", "ORDER_STAFF", "VIEWER"];

export const RETURN_STATUSES = ["REQUESTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "RECEIVED", "REFUNDED", "CLOSED"];

export function nextOrderAction(status) {
  const value = String(status || "").toUpperCase();
  if (["NEW", "PENDING"].includes(value)) {
    return [
      { label: "Accept Order", status: "ACCEPTED" },
      { label: "Reject Order", status: "REJECTED", destructive: true },
    ];
  }
  if (["ACCEPTED", "PROCESSING"].includes(value)) {
    return [
      { label: "Start Preparing", status: "PREPARING" },
      { label: "Cancel Order", status: "CANCELLED", destructive: true },
    ];
  }
  if (value === "PREPARING") return [{ label: "Mark Ready", status: "READY_FOR_PICKUP" }];
  if (value === "READY_FOR_PICKUP") return [{ label: "Hand to Rider", status: "OUT_FOR_DELIVERY" }];
  return [];
}
