"use client";

import {
  BOOKING_STATUSES,
  DEFAULT_COLLECTION_CITIES,
  DEFAULT_OPERATING_HOURS,
  normalizeStatus,
} from "../constants/lab";

const STORAGE_KEY = "medzoos_lab_portal_store_v2";
const EVENT_NAME = "medzoos-lab-store-updated";

const INITIAL_PROFILE = {
  id: "lab-idc-001",
  name: "IDC",
  fullName: "IDC Diagnostics",
  email: "contact@idc.net.pk",
  phone: "+92 51 111 000 432",
  address: "Plot 13-A, G-8 Markaz",
  city: "Islamabad",
  license: "PMDC-LAB-2026-9901",
  bio: "Islamabad Diagnostic Center (IDC) - premier medical diagnostics and laboratory services.",
  homeCollection: true,
  collectionFee: 300,
  freeDeliveryThreshold: 3000,
  collectionCities: [...DEFAULT_COLLECTION_CITIES],
  operatingHours: { ...DEFAULT_OPERATING_HOURS },
  notifications: {
    email: true,
    sms: true,
    newBookings: true,
    reportReady: true,
    cancellations: true,
  },
};

const INITIAL_COLLECTORS = [
  {
    id: "col-1",
    name: "Ali Raza",
    phone: "+92 300 5551234",
    email: "ali.raza@idc.net.pk",
    city: "Islamabad",
    active: true,
    notes: "Assigned to Zone 1 (F & G Sectors)",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "col-2",
    name: "Usman Tariq",
    phone: "+92 312 8884321",
    email: "usman.t@idc.net.pk",
    city: "Rawalpindi",
    active: true,
    notes: "Assigned to Rawalpindi & Saddar",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "col-3",
    name: "Hamza Malik",
    phone: "+92 333 4447788",
    email: "hamza.m@idc.net.pk",
    city: "Islamabad",
    active: true,
    notes: "Assigned to Zone 2 (DHA & Bahria)",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const INITIAL_TESTS = [
  {
    id: "test-cbc",
    name: "Complete Blood Count (CBC)",
    category: "Hematology",
    description: "Evaluates overall health and detects a wide range of disorders including anemia, infection and leukemia.",
    price: 1200,
    discount_price: 1050,
    turnaround: "4 hours",
    sample_type: "Blood",
    preparation_instructions: "No special preparation required.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "test-lipid",
    name: "Lipid Profile",
    category: "Biochemistry",
    description: "Measures total cholesterol, HDL, LDL, and triglycerides to evaluate cardiovascular risk.",
    price: 2500,
    discount_price: 2200,
    turnaround: "12 hours",
    sample_type: "Blood",
    preparation_instructions: "Requires 10-12 hours overnight fasting before sample collection.",
    fasting_required: true,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: "test-hba1c",
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Diabetes",
    description: "Measures average blood sugar levels over the past 2 to 3 months.",
    price: 2000,
    discount_price: 1800,
    turnaround: "6 hours",
    sample_type: "Blood",
    preparation_instructions: "Fasting is not required.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "test-lft",
    name: "Liver Function Test (LFT)",
    category: "Biochemistry",
    description: "Assesses proteins, liver enzymes, and bilirubin in blood to evaluate hepatic function.",
    price: 3200,
    discount_price: null,
    turnaround: "12 hours",
    sample_type: "Blood",
    preparation_instructions: "8 hours fasting is recommended.",
    fasting_required: true,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "test-thyroid",
    name: "Thyroid Profile (T3, T4, TSH)",
    category: "Hormones",
    description: "Comprehensive panel to assess thyroid gland function and hormone regulation.",
    price: 4500,
    discount_price: 4000,
    turnaround: "24 hours",
    sample_type: "Blood",
    preparation_instructions: "Take sample early morning before morning thyroid medication.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "test-vitd",
    name: "Vitamin D (25-OH)",
    category: "Vitamin",
    description: "Measures 25-hydroxyvitamin D level in blood to diagnose deficiency or toxicity.",
    price: 5500,
    discount_price: 4800,
    turnaround: "24 hours",
    sample_type: "Blood",
    preparation_instructions: "No special dietary restrictions.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "test-rft",
    name: "Renal Function Test (RFT / KFT)",
    category: "Biochemistry",
    description: "Evaluates kidney function through Urea, Creatinine, and Electrolytes.",
    price: 2800,
    discount_price: null,
    turnaround: "12 hours",
    sample_type: "Blood",
    preparation_instructions: "Avoid excessive meat consumption 24 hours prior.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "test-urine",
    name: "Urine Routine Examination (Urine R/E)",
    category: "Pathology",
    description: "Physical, chemical and microscopic examination of urine for renal and metabolic disorders.",
    price: 800,
    discount_price: null,
    turnaround: "2 hours",
    sample_type: "Urine",
    preparation_instructions: "Mid-stream early morning clean-catch sample preferred.",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const INITIAL_BOOKINGS = [
  {
    id: "bkg-001",
    booking_number: "MZ-2026-000001",
    patient_name: "Ahmed Khan",
    patient_phone: "+92 301 2345678",
    patient_email: "ahmed.k@example.com",
    patient_gender: "Male",
    patient_age: 38,
    test_id: "test-cbc",
    test_name: "Complete Blood Count (CBC)",
    test_category: "Hematology",
    test_price: 1200,
    turnaround: "4 hours",
    collection_type: "Home Collection",
    collection_address: "House 42, St 15, Sector F-7/2",
    collection_city: "Islamabad",
    booking_date: new Date().toISOString().split("T")[0],
    time_slot: "09:00 AM – 11:00 AM",
    status: BOOKING_STATUSES.NEW,
    payment_status: "UNPAID",
    payment_method: "Cash on Collection",
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 25 * 60000).toISOString(),
        note: "Order placed by patient online",
      },
    ],
  },
  {
    id: "bkg-002",
    booking_number: "MZ-2026-000002",
    patient_name: "Fatima Zahra",
    patient_phone: "+92 321 9876543",
    patient_email: "fatima.z@example.com",
    patient_gender: "Female",
    patient_age: 46,
    test_id: "test-lipid",
    test_name: "Lipid Profile",
    test_category: "Biochemistry",
    test_price: 2500,
    turnaround: "12 hours",
    collection_type: "Home Collection",
    collection_address: "Villa 12, Main Boulevard, DHA Phase 2",
    collection_city: "Islamabad",
    booking_date: new Date().toISOString().split("T")[0],
    time_slot: "11:00 AM – 01:00 PM",
    status: BOOKING_STATUSES.ACCEPTED,
    payment_status: "PAID",
    payment_method: "Card",
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 90 * 60000).toISOString(),
        note: "Order placed online",
      },
      {
        status: BOOKING_STATUSES.ACCEPTED,
        changed_at: new Date(Date.now() - 60 * 60000).toISOString(),
        note: "Order confirmed by lab dispatcher",
      },
    ],
  },
  {
    id: "bkg-003",
    booking_number: "MZ-2026-000003",
    patient_name: "Bilal Tariq",
    patient_phone: "+92 333 7778899",
    patient_email: "bilal.t@example.com",
    patient_gender: "Male",
    patient_age: 52,
    test_id: "test-hba1c",
    test_name: "HbA1c (Glycated Hemoglobin)",
    test_category: "Diabetes",
    test_price: 2000,
    turnaround: "6 hours",
    collection_type: "Home Collection",
    collection_address: "Apartment 4B, Tower 2, Sector G-11/3",
    collection_city: "Islamabad",
    booking_date: new Date().toISOString().split("T")[0],
    time_slot: "07:00 AM – 09:00 AM",
    status: BOOKING_STATUSES.COLLECTOR_ASSIGNED,
    collector_id: "col-1",
    collector_name: "Ali Raza",
    collector_phone: "+92 300 5551234",
    payment_status: "PAID",
    payment_method: "JazzCash",
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 180 * 60000).toISOString(),
        note: "Order placed online",
      },
      {
        status: BOOKING_STATUSES.ACCEPTED,
        changed_at: new Date(Date.now() - 150 * 60000).toISOString(),
        note: "Accepted",
      },
      {
        status: BOOKING_STATUSES.COLLECTOR_ASSIGNED,
        changed_at: new Date(Date.now() - 120 * 60000).toISOString(),
        note: "Collector Ali Raza assigned",
      },
    ],
  },
  {
    id: "bkg-004",
    booking_number: "MZ-2026-000004",
    patient_name: "Sana Mir",
    patient_phone: "+92 345 1122334",
    patient_email: "sana.mir@example.com",
    patient_gender: "Female",
    patient_age: 29,
    test_id: "test-thyroid",
    test_name: "Thyroid Profile (T3, T4, TSH)",
    test_category: "Hormones",
    test_price: 4500,
    turnaround: "24 hours",
    collection_type: "Lab Visit",
    collection_address: "IDC Main Branch, G-8 Markaz",
    collection_city: "Islamabad",
    booking_date: new Date().toISOString().split("T")[0],
    time_slot: "09:00 AM – 11:00 AM",
    status: BOOKING_STATUSES.SAMPLE_COLLECTED,
    sample_collected_at: new Date(Date.now() - 60 * 60000).toISOString(),
    payment_status: "PAID",
    payment_method: "Card",
    created_at: new Date(Date.now() - 240 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 240 * 60000).toISOString(),
        note: "Order placed online",
      },
      {
        status: BOOKING_STATUSES.ACCEPTED,
        changed_at: new Date(Date.now() - 200 * 60000).toISOString(),
        note: "Accepted",
      },
      {
        status: BOOKING_STATUSES.SAMPLE_COLLECTED,
        changed_at: new Date(Date.now() - 60 * 60000).toISOString(),
        note: "Patient visited branch; blood sample collected",
      },
    ],
  },
  {
    id: "bkg-005",
    booking_number: "MZ-2026-000005",
    patient_name: "Zeeshan Ali",
    patient_phone: "+92 313 4455667",
    patient_email: "zeeshan.a@example.com",
    patient_gender: "Male",
    patient_age: 41,
    test_id: "test-lft",
    test_name: "Liver Function Test (LFT)",
    test_category: "Biochemistry",
    test_price: 3200,
    turnaround: "12 hours",
    collection_type: "Home Collection",
    collection_address: "Street 8, Sector I-8/2",
    collection_city: "Islamabad",
    booking_date: new Date().toISOString().split("T")[0],
    time_slot: "07:00 AM – 09:00 AM",
    status: BOOKING_STATUSES.PROCESSING,
    collector_id: "col-2",
    collector_name: "Usman Tariq",
    collector_phone: "+92 312 8884321",
    sample_collected_at: new Date(Date.now() - 150 * 60000).toISOString(),
    processing_started_at: new Date(Date.now() - 75 * 60000).toISOString(),
    payment_status: "PAID",
    payment_method: "Easypaisa",
    created_at: new Date(Date.now() - 300 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 300 * 60000).toISOString(),
        note: "Order placed online",
      },
      {
        status: BOOKING_STATUSES.ACCEPTED,
        changed_at: new Date(Date.now() - 270 * 60000).toISOString(),
        note: "Accepted",
      },
      {
        status: BOOKING_STATUSES.COLLECTOR_ASSIGNED,
        changed_at: new Date(Date.now() - 250 * 60000).toISOString(),
        note: "Usman Tariq assigned",
      },
      {
        status: BOOKING_STATUSES.SAMPLE_COLLECTED,
        changed_at: new Date(Date.now() - 150 * 60000).toISOString(),
        note: "Sample collected from home",
      },
      {
        status: BOOKING_STATUSES.PROCESSING,
        changed_at: new Date(Date.now() - 75 * 60000).toISOString(),
        note: "Automated biochemistry analyzer running",
      },
    ],
  },
  {
    id: "bkg-006",
    booking_number: "MZ-2026-000006",
    patient_name: "Maryam Nawaz",
    patient_phone: "+92 302 9988776",
    patient_email: "maryam.n@example.com",
    patient_gender: "Female",
    patient_age: 34,
    test_id: "test-vitd",
    test_name: "Vitamin D (25-OH)",
    test_category: "Vitamin",
    test_price: 5500,
    turnaround: "24 hours",
    collection_type: "Home Collection",
    collection_address: "House 77, Street 3, Bahria Town Phase 4",
    collection_city: "Rawalpindi",
    booking_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    time_slot: "02:00 PM – 04:00 PM",
    status: BOOKING_STATUSES.REPORT_READY,
    report_file_name: "MZ_2026_000006_VitaminD_Report.pdf",
    report_url: "https://medzoos.com/reports/sample-vitd.pdf",
    report_uploaded_at: new Date(Date.now() - 45 * 60000).toISOString(),
    payment_status: "PAID",
    payment_method: "Online",
    created_at: new Date(Date.now() - 1400 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.NEW,
        changed_at: new Date(Date.now() - 1400 * 60000).toISOString(),
        note: "Order created",
      },
      {
        status: BOOKING_STATUSES.ACCEPTED,
        changed_at: new Date(Date.now() - 1300 * 60000).toISOString(),
        note: "Order accepted",
      },
      {
        status: BOOKING_STATUSES.SAMPLE_COLLECTED,
        changed_at: new Date(Date.now() - 900 * 60000).toISOString(),
        note: "Sample collected",
      },
      {
        status: BOOKING_STATUSES.PROCESSING,
        changed_at: new Date(Date.now() - 500 * 60000).toISOString(),
        note: "Processing sample",
      },
      {
        status: BOOKING_STATUSES.REPORT_READY,
        changed_at: new Date(Date.now() - 45 * 60000).toISOString(),
        note: "Diagnostic report verified by pathologist and uploaded",
      },
    ],
  },
  {
    id: "bkg-007",
    booking_number: "MZ-2026-000007",
    patient_name: "Kamran Akmal",
    patient_phone: "+92 300 4433221",
    patient_email: "kamran.a@example.com",
    patient_gender: "Male",
    patient_age: 49,
    test_id: "test-cbc",
    test_name: "Complete Blood Count (CBC)",
    test_category: "Hematology",
    test_price: 1200,
    turnaround: "4 hours",
    collection_type: "Lab Visit",
    collection_address: "IDC Main Branch, G-8 Markaz",
    collection_city: "Islamabad",
    booking_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    time_slot: "10:00 AM – 12:00 PM",
    status: BOOKING_STATUSES.COMPLETED,
    report_file_name: "MZ_2026_000007_CBC_Report.pdf",
    report_url: "https://medzoos.com/reports/sample-cbc.pdf",
    completed_at: new Date(Date.now() - 120 * 60000).toISOString(),
    payment_status: "PAID",
    payment_method: "Card",
    created_at: new Date(Date.now() - 1500 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.COMPLETED,
        changed_at: new Date(Date.now() - 120 * 60000).toISOString(),
        note: "Booking completed and delivered to customer",
      },
    ],
  },
  {
    id: "bkg-008",
    booking_number: "MZ-2026-000008",
    patient_name: "Zainab Bibi",
    patient_phone: "+92 334 5566778",
    patient_email: "zainab.b@example.com",
    patient_gender: "Female",
    patient_age: 61,
    test_id: "test-rft",
    test_name: "Renal Function Test (RFT / KFT)",
    test_category: "Biochemistry",
    test_price: 2800,
    turnaround: "12 hours",
    collection_type: "Lab Visit",
    collection_address: "IDC Saddar Branch",
    collection_city: "Rawalpindi",
    booking_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    time_slot: "09:00 AM – 11:00 AM",
    status: BOOKING_STATUSES.COMPLETED,
    report_file_name: "MZ_2026_000008_RFT_Report.pdf",
    report_url: "https://medzoos.com/reports/sample-rft.pdf",
    completed_at: new Date(Date.now() - 1800 * 60000).toISOString(),
    payment_status: "PAID",
    payment_method: "Bank Transfer",
    created_at: new Date(Date.now() - 2800 * 60000).toISOString(),
    history: [
      {
        status: BOOKING_STATUSES.COMPLETED,
        changed_at: new Date(Date.now() - 1800 * 60000).toISOString(),
        note: "Completed",
      },
    ],
  },
];

const NOTIFICATIONS_KEY = "medzoos_lab_notifications_v2";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Booking Received",
    message: "Ahmed Khan booked Complete Blood Count (CBC) for Home Collection.",
    time: "25 mins ago",
    read: false,
    type: "booking",
  },
  {
    id: "notif-2",
    title: "Collector Dispatched",
    message: "Ali Raza dispatched for sample collection in Sector G-11/3.",
    time: "2 hours ago",
    read: true,
    type: "collector",
  },
  {
    id: "notif-3",
    title: "Report Verified",
    message: "Vitamin D diagnostic report ready for Maryam Nawaz.",
    time: "3 hours ago",
    read: true,
    type: "report",
  },
];

export function getLocalStore() {
  if (typeof window === "undefined") {
    return {
      profile: INITIAL_PROFILE,
      collectors: INITIAL_COLLECTORS,
      tests: INITIAL_TESTS,
      bookings: INITIAL_BOOKINGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        profile: INITIAL_PROFILE,
        collectors: INITIAL_COLLECTORS,
        tests: INITIAL_TESTS,
        bookings: INITIAL_BOOKINGS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read lab store", e);
    return {
      profile: INITIAL_PROFILE,
      collectors: INITIAL_COLLECTORS,
      tests: INITIAL_TESTS,
      bookings: INITIAL_BOOKINGS,
    };
  }
}

export function saveLocalStore(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Broadcast live event across components and tabs
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  } catch (e) {
    console.error("Failed to save lab store", e);
  }
}

export function getNotifications() {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent("medzoos-notifications-updated", { detail: notifs }));
  } catch (e) {
    console.error(e);
  }
}

export function addNotification(notif) {
  const list = getNotifications();
  const updated = [
    {
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
      ...notif,
    },
    ...list,
  ].slice(0, 20);
  saveNotifications(updated);
  return updated;
}

export function resetLocalStoreToEmpty() {
  if (typeof window === "undefined") return;
  const empty = {
    profile: INITIAL_PROFILE,
    collectors: [],
    tests: [],
    bookings: [],
  };
  saveLocalStore(empty);
  return empty;
}

export function resetLocalStoreToSeed() {
  if (typeof window === "undefined") return;
  const seeded = {
    profile: INITIAL_PROFILE,
    collectors: INITIAL_COLLECTORS,
    tests: INITIAL_TESTS,
    bookings: INITIAL_BOOKINGS,
  };
  saveLocalStore(seeded);
  return seeded;
}

export const labLocalStoreApi = {
  getProfile: () => {
    const store = getLocalStore();
    return store.profile || INITIAL_PROFILE;
  },
  updateProfile: (updates) => {
    const store = getLocalStore();
    store.profile = { ...store.profile, ...updates };
    saveLocalStore(store);
    return store.profile;
  },
  getCollectors: () => {
    const store = getLocalStore();
    return store.collectors || [];
  },
  createCollector: (data) => {
    const store = getLocalStore();
    const newCollector = {
      id: `col-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    store.collectors = [newCollector, ...(store.collectors || [])];
    saveLocalStore(store);
    addNotification({
      title: "Collector Registered",
      message: `Phlebotomist ${data.name} added to active dispatch team.`,
      type: "collector",
    });
    return newCollector;
  },
  updateCollector: (id, updates) => {
    const store = getLocalStore();
    store.collectors = (store.collectors || []).map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    saveLocalStore(store);
    return store.collectors.find((c) => c.id === id);
  },
  deleteCollector: (id) => {
    const store = getLocalStore();
    store.collectors = (store.collectors || []).filter((c) => c.id !== id);
    saveLocalStore(store);
    return true;
  },
  getTests: () => {
    const store = getLocalStore();
    return store.tests || [];
  },
  createTest: (testData) => {
    const store = getLocalStore();
    const newTest = {
      id: `test-${Date.now()}`,
      ...testData,
      created_at: new Date().toISOString(),
    };
    store.tests = [newTest, ...(store.tests || [])];
    saveLocalStore(store);
    addNotification({
      title: "Catalog Updated",
      message: `New diagnostic test "${testData.name}" is now available for patient booking.`,
      type: "test",
    });
    return newTest;
  },
  updateTest: (id, updates) => {
    const store = getLocalStore();
    store.tests = (store.tests || []).map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    saveLocalStore(store);
    return store.tests.find((t) => t.id === id);
  },
  deleteTest: (id) => {
    const store = getLocalStore();
    store.tests = (store.tests || []).filter((t) => t.id !== id);
    saveLocalStore(store);
    return true;
  },
  getBookings: () => {
    const store = getLocalStore();
    return store.bookings || [];
  },
  getBookingById: (id) => {
    const store = getLocalStore();
    return (store.bookings || []).find((b) => b.id === id || b.booking_number === id);
  },
  createBooking: (bookingData) => {
    const store = getLocalStore();
    const seq = String((store.bookings || []).length + 1).padStart(6, "0");
    const newNumber = `MZ-2026-${seq}`;

    const newBooking = {
      id: `bkg-${Date.now()}`,
      booking_number: newNumber,
      status: BOOKING_STATUSES.NEW,
      payment_status: bookingData.payment_status || "UNPAID",
      payment_method: bookingData.payment_method || "Cash on Collection",
      created_at: new Date().toISOString(),
      booking_date: bookingData.booking_date || new Date().toISOString().split("T")[0],
      time_slot: bookingData.time_slot || "09:00 AM – 11:00 AM",
      ...bookingData,
      history: [
        {
          status: BOOKING_STATUSES.NEW,
          changed_at: new Date().toISOString(),
          note: "New patient test booking received",
        },
      ],
    };

    store.bookings = [newBooking, ...(store.bookings || [])];
    saveLocalStore(store);

    addNotification({
      title: "New Booking Received",
      message: `${newBooking.patient_name || "Patient"} booked ${newBooking.test_name} (${newNumber}).`,
      type: "booking",
    });

    return newBooking;
  },
  simulateIncomingOrder: () => {
    const store = getLocalStore();
    const activeTests = (store.tests || []).filter((t) => t.status === "active");
    const test =
      activeTests.length > 0
        ? activeTests[Math.floor(Math.random() * activeTests.length)]
        : INITIAL_TESTS[0];

    const samplePatients = [
      { name: "Haris Rauf", phone: "+92 301 9988771", email: "haris.r@example.com", gender: "Male", age: 31, city: "Islamabad", address: "Street 4, Sector F-10/3" },
      { name: "Ayesha Malik", phone: "+92 322 4455662", email: "ayesha.m@example.com", gender: "Female", age: 27, city: "Rawalpindi", address: "Flat 12, Civic Center, Bahria Town" },
      { name: "Noman Ali", phone: "+92 333 1122338", email: "noman.a@example.com", gender: "Male", age: 44, city: "Islamabad", address: "House 18, Street 9, Sector G-9/2" },
      { name: "Sadia Qureshi", phone: "+92 345 8899004", email: "sadia.q@example.com", gender: "Female", age: 39, city: "Islamabad", address: "Plot 88, Naval Anchorage" },
      { name: "Danyal Sheikh", phone: "+92 300 7788995", email: "danyal.s@example.com", gender: "Male", age: 35, city: "Rawalpindi", address: "House 5, Street 2, Westridge 1" },
    ];

    const patient = samplePatients[Math.floor(Math.random() * samplePatients.length)];
    const isHome = Math.random() > 0.35;
    const slots = ["07:00 AM – 09:00 AM", "09:00 AM – 11:00 AM", "11:00 AM – 01:00 PM", "02:00 PM – 04:00 PM"];
    const slot = slots[Math.floor(Math.random() * slots.length)];

    return labLocalStoreApi.createBooking({
      patient_name: patient.name,
      patient_phone: patient.phone,
      patient_email: patient.email,
      patient_gender: patient.gender,
      patient_age: patient.age,
      test_id: test.id,
      test_name: test.name,
      test_category: test.category,
      test_price: test.price,
      turnaround: test.turnaround,
      collection_type: isHome ? "Home Collection" : "Lab Visit",
      collection_address: isHome ? patient.address : "IDC Main Branch, G-8 Markaz",
      collection_city: patient.city,
      time_slot: slot,
      payment_method: isHome ? "Cash on Collection" : "Card",
      payment_status: isHome ? "UNPAID" : "PAID",
    });
  },
  updateBookingStatus: (id, nextStatus, note = "") => {
    const store = getLocalStore();
    const norm = normalizeStatus(nextStatus);
    let updatedBooking = null;

    store.bookings = (store.bookings || []).map((b) => {
      if (b.id === id || b.booking_number === id) {
        const history = b.history || [];
        const updated = {
          ...b,
          status: norm,
          updated_at: new Date().toISOString(),
          history: [
            ...history,
            {
              status: norm,
              changed_at: new Date().toISOString(),
              note: note || `Status changed to ${norm}`,
            },
          ],
        };
        if (norm === BOOKING_STATUSES.SAMPLE_COLLECTED && !updated.sample_collected_at) {
          updated.sample_collected_at = new Date().toISOString();
        }
        // Cash at lab: payment received when sample is taken at counter
        const method = String(updated.payment_method || "").toLowerCase();
        if (
          ["cod", "cash", "cash on collection", "pay at lab"].some((m) => method.includes(m)) &&
          String(updated.payment_status || "").toUpperCase() !== "PAID" &&
          [
            BOOKING_STATUSES.SAMPLE_COLLECTED,
            BOOKING_STATUSES.PROCESSING,
            BOOKING_STATUSES.REPORT_READY,
            BOOKING_STATUSES.COMPLETED,
          ].includes(norm)
        ) {
          updated.payment_status = "PAID";
        }
        if (norm === BOOKING_STATUSES.PROCESSING && !updated.processing_started_at) {
          updated.processing_started_at = new Date().toISOString();
        }
        if (norm === BOOKING_STATUSES.COMPLETED && !updated.completed_at) {
          updated.completed_at = new Date().toISOString();
          updated.payment_status = "PAID";
        }
        updatedBooking = updated;
        return updated;
      }
      return b;
    });

    saveLocalStore(store);

    if (updatedBooking) {
      addNotification({
        title: `Status: ${STATUS_LABELS[norm] || norm}`,
        message: `Order ${updatedBooking.booking_number} (${updatedBooking.patient_name}) updated.`,
        type: "status",
      });
    }

    return updatedBooking;
  },
  markPaymentReceived: (id) => {
    const store = getLocalStore();
    let updatedBooking = null;

    store.bookings = (store.bookings || []).map((b) => {
      if (b.id === id || b.booking_number === id) {
        const updated = {
          ...b,
          payment_status: "PAID",
          updated_at: new Date().toISOString(),
          history: [
            ...(b.history || []),
            {
              status: b.status,
              changed_at: new Date().toISOString(),
              note: "Cash payment marked as received at lab",
            },
          ],
        };
        updatedBooking = updated;
        return updated;
      }
      return b;
    });

    saveLocalStore(store);
    return updatedBooking;
  },
  assignCollector: (bookingId, { collector_id, collector_name, collector_phone, note }) => {
    const store = getLocalStore();
    let updatedBooking = null;

    store.bookings = (store.bookings || []).map((b) => {
      if (b.id === bookingId || b.booking_number === bookingId) {
        const history = b.history || [];
        const updated = {
          ...b,
          collector_id,
          collector_name,
          collector_phone,
          status: BOOKING_STATUSES.COLLECTOR_ASSIGNED,
          updated_at: new Date().toISOString(),
          history: [
            ...history,
            {
              status: BOOKING_STATUSES.COLLECTOR_ASSIGNED,
              changed_at: new Date().toISOString(),
              note: note || `Collector ${collector_name} assigned`,
            },
          ],
        };
        updatedBooking = updated;
        return updated;
      }
      return b;
    });

    saveLocalStore(store);

    if (updatedBooking) {
      addNotification({
        title: "Collector Assigned",
        message: `${collector_name} assigned to order ${updatedBooking.booking_number}.`,
        type: "collector",
      });
    }

    return updatedBooking;
  },
  uploadReport: (bookingId, { report_url, report_file_name, notes }) => {
    const store = getLocalStore();
    let updatedBooking = null;

    store.bookings = (store.bookings || []).map((b) => {
      if (b.id === bookingId || b.booking_number === bookingId) {
        const history = b.history || [];
        const updated = {
          ...b,
          report_url: report_url || b.report_url || "https://medzoos.com/reports/diagnostic-report.pdf",
          report_file_name: report_file_name || b.report_file_name || "Diagnostic_Report.pdf",
          report_uploaded_at: new Date().toISOString(),
          report_notes: notes || "",
          status: BOOKING_STATUSES.REPORT_READY,
          updated_at: new Date().toISOString(),
          history: [
            ...history,
            {
              status: BOOKING_STATUSES.REPORT_READY,
              changed_at: new Date().toISOString(),
              note: notes || "Diagnostic report verified & uploaded",
            },
          ],
        };
        updatedBooking = updated;
        return updated;
      }
      return b;
    });

    saveLocalStore(store);

    if (updatedBooking) {
      addNotification({
        title: "Report Uploaded",
        message: `Verified report ready for ${updatedBooking.patient_name} (${updatedBooking.booking_number}).`,
        type: "report",
      });
    }

    return updatedBooking;
  },
  getReportsSummary: () => {
    const store = getLocalStore();
    const bookings = store.bookings || [];
    const totalBookings = bookings.length;
    const completedTests = bookings.filter(
      (b) => normalizeStatus(b.status) === BOOKING_STATUSES.COMPLETED
    ).length;
    const pendingReports = bookings.filter((b) =>
      [
        BOOKING_STATUSES.SAMPLE_COLLECTED,
        BOOKING_STATUSES.PROCESSING,
        BOOKING_STATUSES.ACCEPTED,
        BOOKING_STATUSES.COLLECTOR_ASSIGNED,
      ].includes(normalizeStatus(b.status))
    ).length;

    const revenue = bookings
      .filter((b) =>
        [BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.REPORT_READY].includes(
          normalizeStatus(b.status)
        ) || b.payment_status === "PAID"
      )
      .reduce((sum, b) => sum + (Number(b.test_price) || 0), 0);

    const testMap = {};
    for (const b of bookings) {
      const name = b.test_name || "Diagnostic Test";
      if (!testMap[name]) {
        testMap[name] = { name, count: 0, revenue: 0 };
      }
      testMap[name].count += 1;
      if (
        [BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.REPORT_READY].includes(
          normalizeStatus(b.status)
        ) || b.payment_status === "PAID"
      ) {
        testMap[name].revenue += Number(b.test_price) || 0;
      }
    }

    const topTests = Object.values(testMap).sort((a, b) => b.count - a.count);

    return {
      totalBookings,
      completedTests,
      pendingReports,
      revenue,
      topTests,
    };
  },
};
