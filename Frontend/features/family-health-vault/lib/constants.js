export const RELATIONSHIPS = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Grandfather",
  "Grandmother",
  "Caregiver",
  "Other",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const ACCESS_ROLES = [
  { value: "admin", label: "Family Admin (full control)" },
  { value: "adult_member", label: "Adult Member (manage own records)" },
  { value: "caregiver", label: "Caregiver (limited access)" },
  { value: "viewer", label: "Read-only Viewer" },
];

export const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
];

export const FAMILY_HISTORY_CONDITIONS = [
  "Heart Disease",
  "Cancer",
  "Stroke",
  "Diabetes",
  "High Blood Pressure",
];

export const LAB_CATEGORIES = [
  { value: "cbc", label: "CBC" },
  { value: "hba1c", label: "HbA1c" },
  { value: "vitamin_d", label: "Vitamin D" },
  { value: "lipid", label: "Lipid Profile" },
  { value: "thyroid", label: "Thyroid" },
  { value: "kidney", label: "Kidney Function" },
  { value: "liver", label: "Liver Function" },
  { value: "urine", label: "Urine Test" },
  { value: "other", label: "Others" },
];

export const VITAL_TYPES = [
  { value: "blood_pressure", label: "Blood Pressure" },
  { value: "sugar", label: "Blood Sugar" },
  { value: "weight", label: "Weight" },
  { value: "height", label: "Height" },
  { value: "bmi", label: "BMI" },
  { value: "heart_rate", label: "Heart Rate" },
  { value: "temperature", label: "Temperature" },
  { value: "spo2", label: "Oxygen Saturation" },
];

export const TIMELINE_EVENT_TYPES = [
  { value: "doctor_consultation", label: "Doctor Consultation" },
  { value: "prescription", label: "Prescription" },
  { value: "medicine_ordered", label: "Medicine Ordered" },
  { value: "lab_report", label: "Lab Report" },
  { value: "vaccination", label: "Vaccination" },
  { value: "hospital_visit", label: "Hospital Visit" },
  { value: "blood_pressure", label: "Blood Pressure Reading" },
  { value: "weight", label: "Weight" },
  { value: "ecg", label: "ECG" },
  { value: "mri", label: "MRI" },
  { value: "other", label: "Other" },
];

export const MEMBER_TABS = [
  { id: "overview", label: "Overview" },
  { id: "medical", label: "Medical Profile" },
  { id: "timeline", label: "Timeline" },
  { id: "medicines", label: "Medicines" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "labs", label: "Lab Reports" },
  { id: "vaccinations", label: "Vaccinations" },
  { id: "vitals", label: "Vitals" },
  { id: "doctors", label: "Doctors" },
  { id: "appointments", label: "Appointments" },
  { id: "emergency", label: "Emergency" },
];

export const VAULT_VIEWS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "copilot", label: "AI Copilot", icon: "copilot" },
  { id: "summary", label: "Weekly Summary", icon: "summary" },
  { id: "settings", label: "Family Settings", icon: "settings" },
];

export function relationshipEmoji(relationship) {
  const map = {
    Father: "👨",
    Mother: "👩",
    Spouse: "💑",
    Son: "👦",
    Daughter: "👧",
    Grandfather: "👴",
    Grandmother: "👵",
    Caregiver: "🤝",
    Other: "👤",
  };
  return map[relationship] || "👤";
}

export function scoreColor(score) {
  if (score == null) return "text-slate-600 bg-slate-100";
  if (score >= 80) return "text-emerald-600 bg-emerald-50";
  if (score >= 65) return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const DEFAULT_MEDICAL_PROFILE = {
  conditions: [],
  allergies: { medicine: [], food: [], environmental: [] },
  surgeries: [],
  familyHistory: [],
  lifestyle: {},
};

export const EMPTY_MEMBER = {
  full_name: "",
  relationship: "Father",
  gender: "",
  date_of_birth: "",
  blood_group: "",
  height_cm: "",
  weight_kg: "",
  phone: "",
  email: "",
  access_role: "member",
};

export const EMPTY_FAMILY = {
  name: "",
  home_address: "",
  emergency_contact: "",
  preferred_hospital: "",
  preferred_pharmacy: "",
  preferred_lab: "",
};
