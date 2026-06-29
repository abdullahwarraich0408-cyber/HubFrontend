export const DOCTOR_NOTIFICATIONS = [];
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
