export const DEFAULT_PROFILE_DATA = {
  dob: "",
  bloodGroup: "",
  familyMembers: [],
  medicalRecords: [],
  paymentMethods: [],
  notificationPrefs: {
    orders: true,
    appointments: true,
    offers: false,
    health: true,
  },
  recentNotifications: [],
};

export const NOTIFICATION_PREF_LABELS = [
  { id: "orders", label: "Order updates", desc: "Delivery and status changes" },
  { id: "appointments", label: "Appointment reminders", desc: "Doctor and lab bookings" },
  { id: "offers", label: "Offers & promotions", desc: "Deals and discount alerts" },
  { id: "health", label: "Health tips", desc: "Wellness articles and reminders" },
];

export function mergeProfileData(profileData) {
  return {
    ...DEFAULT_PROFILE_DATA,
    ...(profileData || {}),
    notificationPrefs: {
      ...DEFAULT_PROFILE_DATA.notificationPrefs,
      ...(profileData?.notificationPrefs || {}),
    },
  };
}

export function formatMemberSince(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatDobDisplay(dob) {
  if (!dob) return "";
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return dob;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
