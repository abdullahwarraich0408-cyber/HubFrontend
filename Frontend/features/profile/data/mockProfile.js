export const USER_PROFILE = {
  name: "Ahmed Khan",
  email: "ahmed.khan@example.com",
  phone: "+92 300 1234567",
  dob: "Mar 15, 1988",
  bloodGroup: "B+",
  memberSince: "Jan 2024",
};

export const FAMILY_MEMBERS = [
  { id: "1", name: "Sara Khan", relation: "Spouse", age: 34, bloodGroup: "O+" },
  { id: "2", name: "Ali Khan", relation: "Son", age: 8, bloodGroup: "B+" },
  { id: "3", name: "Fatima Khan", relation: "Daughter", age: 5, bloodGroup: "B+" },
];

export const SAVED_ADDRESSES = [
  { id: "1", label: "Home", line: "House 42, Block 7, Clifton", city: "Karachi", phone: "+92 300 1234567", isDefault: true },
  { id: "2", label: "Office", line: "Office 12B, I.I. Chundrigar Road", city: "Karachi", phone: "+92 300 1234567", isDefault: false },
  { id: "3", label: "Parents", line: "Street 5, Model Town", city: "Lahore", phone: "+92 321 9876543", isDefault: false },
];

export const PRESCRIPTIONS = [
  { id: "RX-001", doctor: "Dr. Ayesha Khan", date: "Jun 09, 2026", medicines: ["Panadol Extra 500mg", "Vitamin C 1000mg"], status: "active" },
  { id: "RX-002", doctor: "Dr. Hassan Ali", date: "May 20, 2026", medicines: ["Amlodipine 5mg", "Atorvastatin 10mg"], status: "completed" },
];

export const MEDICAL_RECORDS = [
  { id: "MR-001", type: "Lab Report", title: "Executive Full Body Checkup", date: "Jun 09, 2026", lab: "Shaukat Khanum Labs" },
  { id: "MR-002", type: "Lab Report", title: "HbA1c & Fasting Glucose", date: "Apr 12, 2026", lab: "Dr. Essa Laboratory" },
  { id: "MR-003", type: "Consultation", title: "Video Consult — Dr. Ayesha Khan", date: "Jun 09, 2026", lab: "PharmaHub" },
];

export const PAYMENT_METHODS = [
  { id: "1", type: "card", label: "Visa ending 4242", expiry: "12/28", isDefault: true },
  { id: "2", type: "wallet", label: "JazzCash", expiry: null, isDefault: false },
  { id: "3", type: "wallet", label: "Easypaisa", expiry: null, isDefault: false },
];

export const NOTIFICATION_PREFS = [
  { id: "orders", label: "Order updates", desc: "Delivery and status changes", enabled: true },
  { id: "appointments", label: "Appointment reminders", desc: "Doctor and lab bookings", enabled: true },
  { id: "offers", label: "Offers & promotions", desc: "Deals and discount alerts", enabled: false },
  { id: "health", label: "Health tips", desc: "Wellness articles and reminders", enabled: true },
];

export const RECENT_NOTIFICATIONS = [
  { id: "1", title: "Order shipped", message: "ORD-M-2025-04821 is out for delivery", time: "2 hours ago", read: false },
  { id: "2", title: "Lab report ready", message: "Your Full Body Checkup report is available", time: "1 day ago", read: true },
  { id: "3", title: "Appointment confirmed", message: "Dr. Hassan Ali — Jun 11, 4:30 PM", time: "2 days ago", read: true },
];

export const DASHBOARD_STATS = [
  { label: "Active Orders", value: "2", href: "/orders" },
  { label: "Upcoming Appointments", value: "1", href: "/orders?type=doctor" },
  { label: "Active Prescriptions", value: "1", href: null },
  { label: "Family Members", value: "3", href: null },
];
