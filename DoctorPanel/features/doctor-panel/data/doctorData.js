export const DOCTOR_NOTIFICATIONS = [
  {
    id: "sys-notif-1",
    type: "system",
    title: "System Update: Telehealth Video 2.0",
    message: "High-definition encrypted video consultations with real-time prescription drafting are now active.",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    link: "/doctor/schedule",
  },
  {
    id: "sys-notif-2",
    type: "system",
    title: "Physician Profile Verified",
    message: "Your PMDC license and clinical credentials have been verified. Your profile is live for patient bookings.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
    link: "/doctor/settings",
  },
  {
    id: "sys-notif-3",
    type: "system",
    title: "Weekly Practice Summary",
    message: "View your patient appointment analytics and earnings breakdown in your Command Center.",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    read: true,
    link: "/doctor/dashboard",
  },
];
export const DEFAULT_DOCTOR_PROFILE = {
  name: "Doctor",
  email: "",
  phone: "",
  specialty: "",
  hospital: "",
  experience: "",
  consultationFee: "",
  languages: "",
  bio: "",
  photo: "",
  slots: [],
  online: true,
  notifications: {
    email: true,
    sms: true,
    reminders: true,
    marketing: false,
  },
};
export const DEFAULT_SCHEDULE = [
  { day: "Monday", slots: [] },
  { day: "Tuesday", slots: [] },
  { day: "Wednesday", slots: [] },
  { day: "Thursday", slots: [] },
  { day: "Friday", slots: [] },
  { day: "Saturday", slots: [] },
  { day: "Sunday", slots: [] }
];
