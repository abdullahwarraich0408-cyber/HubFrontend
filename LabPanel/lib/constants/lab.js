export const BOOKING_STATUSES = {
  NEW: "NEW",
  ACCEPTED: "ACCEPTED",
  COLLECTOR_ASSIGNED: "COLLECTOR_ASSIGNED",
  SAMPLE_COLLECTED: "SAMPLE_COLLECTED",
  PROCESSING: "PROCESSING",
  REPORT_READY: "REPORT_READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
};

export const STATUS_LABELS = {
  [BOOKING_STATUSES.NEW]: "New",
  [BOOKING_STATUSES.ACCEPTED]: "Accepted",
  [BOOKING_STATUSES.COLLECTOR_ASSIGNED]: "Collector Assigned",
  [BOOKING_STATUSES.SAMPLE_COLLECTED]: "Sample Collected",
  [BOOKING_STATUSES.PROCESSING]: "Processing",
  [BOOKING_STATUSES.REPORT_READY]: "Report Ready",
  [BOOKING_STATUSES.COMPLETED]: "Completed",
  [BOOKING_STATUSES.CANCELLED]: "Cancelled",
  [BOOKING_STATUSES.REJECTED]: "Rejected",
  // Legacy aliases
  pending: "New",
  confirmed: "Accepted",
  testing: "Processing",
  report_uploaded: "Report Ready",
};

export const STATUS_BADGE_STYLES = {
  [BOOKING_STATUSES.NEW]: {
    bg: "bg-blue-50 text-blue-700 border border-blue-200/90 font-semibold",
    dot: "bg-blue-500",
    label: "New",
  },
  [BOOKING_STATUSES.ACCEPTED]: {
    bg: "bg-[#DEEEF9] text-[#17618E] border border-[#17618E]/30 font-semibold",
    dot: "bg-[#17618E]",
    label: "Accepted",
  },
  [BOOKING_STATUSES.COLLECTOR_ASSIGNED]: {
    bg: "bg-purple-50 text-purple-700 border border-purple-200/90 font-semibold",
    dot: "bg-purple-500",
    label: "Collector Assigned",
  },
  [BOOKING_STATUSES.SAMPLE_COLLECTED]: {
    bg: "bg-orange-50 text-orange-700 border border-orange-200/90 font-semibold",
    dot: "bg-orange-500",
    label: "Sample Collected",
  },
  [BOOKING_STATUSES.PROCESSING]: {
    bg: "bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold",
    dot: "bg-indigo-600 animate-pulse",
    label: "Processing",
  },
  [BOOKING_STATUSES.REPORT_READY]: {
    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-semibold",
    dot: "bg-emerald-500",
    label: "Report Ready",
  },
  [BOOKING_STATUSES.COMPLETED]: {
    bg: "bg-green-50 text-green-700 border border-green-200/90 font-semibold",
    dot: "bg-green-600",
    label: "Completed",
  },
  [BOOKING_STATUSES.CANCELLED]: {
    bg: "bg-slate-100 text-slate-600 border border-slate-200 font-semibold",
    dot: "bg-slate-400",
    label: "Cancelled",
  },
  [BOOKING_STATUSES.REJECTED]: {
    bg: "bg-rose-50 text-rose-700 border border-rose-200/90 font-semibold",
    dot: "bg-rose-500",
    label: "Rejected",
  },
  // Legacy mappings
  pending: {
    bg: "bg-blue-50 text-blue-700 border border-blue-200/90 font-semibold",
    dot: "bg-blue-500",
    label: "New",
  },
  confirmed: {
    bg: "bg-[#DEEEF9] text-[#17618E] border border-[#17618E]/30 font-semibold",
    dot: "bg-[#17618E]",
    label: "Accepted",
  },
  collector_assigned: {
    bg: "bg-purple-50 text-purple-700 border border-purple-200/90 font-semibold",
    dot: "bg-purple-500",
    label: "Collector Assigned",
  },
  sample_collected: {
    bg: "bg-orange-50 text-orange-700 border border-orange-200/90 font-semibold",
    dot: "bg-orange-500",
    label: "Sample Collected",
  },
  testing: {
    bg: "bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold",
    dot: "bg-indigo-600 animate-pulse",
    label: "Processing",
  },
  report_uploaded: {
    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-semibold",
    dot: "bg-emerald-500",
    label: "Report Ready",
  },
  completed: {
    bg: "bg-green-50 text-green-700 border border-green-200/90 font-semibold",
    dot: "bg-green-600",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-slate-100 text-slate-600 border border-slate-200 font-semibold",
    dot: "bg-slate-400",
    label: "Cancelled",
  },
  rejected: {
    bg: "bg-rose-50 text-rose-700 border border-rose-200/90 font-semibold",
    dot: "bg-rose-500",
    label: "Rejected",
  },
};

export const TEST_CATEGORIES = [
  "Hematology",
  "Biochemistry",
  "Hormones",
  "Immunology",
  "Microbiology",
  "Pathology",
  "Radiology",
  "Blood",
  "Diabetes",
  "Heart",
  "Vitamin",
  "Full Body Checkup",
  "Other",
];

export const TURNAROUND_OPTIONS = [
  "2 hours",
  "4 hours",
  "6 hours",
  "12 hours",
  "24 hours",
  "48 hours",
  "3 days",
  "5 days",
];

export const SAMPLE_TYPES = [
  "Blood",
  "Urine",
  "Serum",
  "Plasma",
  "Swab",
  "Saliva",
  "Stool",
  "Tissue",
  "Other",
];

export const COLLECTION_TYPES = {
  HOME: "Home Collection",
  LAB_VISIT: "Lab Visit",
};

export const PAYMENT_METHODS = [
  "Cash",
  "Card",
  "Bank Transfer",
  "JazzCash",
  "Easypaisa",
  "Online",
];

export const DEFAULT_COLLECTION_CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Faisalabad",
  "Peshawar",
];

export const DEFAULT_OPERATING_HOURS = {
  Monday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Tuesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Wednesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Thursday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Friday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Saturday: { open: "08:00 AM", close: "10:00 PM", closed: false },
  Sunday: { open: "09:00 AM", close: "06:00 PM", closed: false },
};

export function normalizeStatus(rawStatus = "") {
  const s = String(rawStatus).toUpperCase().replace(/\s+/g, "_");
  if (s === "PENDING" || s === "NEW") return BOOKING_STATUSES.NEW;
  if (s === "CONFIRMED" || s === "ACCEPTED") return BOOKING_STATUSES.ACCEPTED;
  if (s === "COLLECTOR_ASSIGNED") return BOOKING_STATUSES.COLLECTOR_ASSIGNED;
  if (s === "SAMPLE_COLLECTED") return BOOKING_STATUSES.SAMPLE_COLLECTED;
  if (s === "TESTING" || s === "PROCESSING") return BOOKING_STATUSES.PROCESSING;
  if (s === "REPORT_UPLOADED" || s === "REPORT_READY") return BOOKING_STATUSES.REPORT_READY;
  if (s === "COMPLETED") return BOOKING_STATUSES.COMPLETED;
  if (s === "CANCELLED") return BOOKING_STATUSES.CANCELLED;
  if (s === "REJECTED") return BOOKING_STATUSES.REJECTED;
  return s;
}

export function toBackendStatus(status = "") {
  const s = String(status || "").toUpperCase().replace(/\s+/g, "_");
  if (s === "NEW" || s === "PENDING") return "pending";
  if (s === "ACCEPTED" || s === "CONFIRMED") return "confirmed";
  if (s === "COLLECTOR_ASSIGNED") return "collector_assigned";
  if (s === "SAMPLE_COLLECTED") return "sample_collected";
  if (s === "PROCESSING" || s === "TESTING") return "testing";
  if (s === "REPORT_READY" || s === "REPORT_UPLOADED") return "report_uploaded";
  if (s === "COMPLETED") return "completed";
  if (s === "CANCELLED") return "cancelled";
  if (s === "REJECTED") return "rejected";
  return status.toLowerCase();
}

export const BOOKING_TRANSITIONS = {
  [BOOKING_STATUSES.NEW]: [
    { label: "Accept", nextStatus: BOOKING_STATUSES.ACCEPTED, variant: "primary" },
    { label: "Reject", nextStatus: BOOKING_STATUSES.REJECTED, variant: "danger", requireConfirm: true },
  ],
  [BOOKING_STATUSES.ACCEPTED]: [
    { label: "Assign Collector", action: "assign_collector", variant: "primary" },
    { label: "Mark Sample Collected", nextStatus: BOOKING_STATUSES.SAMPLE_COLLECTED, variant: "secondary" },
    { label: "Cancel", nextStatus: BOOKING_STATUSES.CANCELLED, variant: "danger", requireConfirm: true },
  ],
  [BOOKING_STATUSES.COLLECTOR_ASSIGNED]: [
    { label: "Mark Sample Collected", nextStatus: BOOKING_STATUSES.SAMPLE_COLLECTED, variant: "primary" },
    { label: "Reassign Collector", action: "assign_collector", variant: "secondary" },
    { label: "Cancel", nextStatus: BOOKING_STATUSES.CANCELLED, variant: "danger", requireConfirm: true },
  ],
  [BOOKING_STATUSES.SAMPLE_COLLECTED]: [
    { label: "Start Processing", nextStatus: BOOKING_STATUSES.PROCESSING, variant: "primary" },
  ],
  [BOOKING_STATUSES.PROCESSING]: [
    { label: "Upload Report", action: "upload_report", variant: "primary" },
    { label: "Mark Report Ready", nextStatus: BOOKING_STATUSES.REPORT_READY, variant: "secondary" },
  ],
  [BOOKING_STATUSES.REPORT_READY]: [
    { label: "Complete Booking", nextStatus: BOOKING_STATUSES.COMPLETED, variant: "success", requireConfirm: true },
    { label: "Replace Report", action: "upload_report", variant: "secondary" },
  ],
  [BOOKING_STATUSES.COMPLETED]: [],
  [BOOKING_STATUSES.CANCELLED]: [],
  [BOOKING_STATUSES.REJECTED]: [],
};
