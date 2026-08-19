import { BOOKING_STATUSES, normalizeStatus } from "../constants/lab";

function formatDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeValue) {
  if (!timeValue) return "";
  const date = new Date(timeValue);
  if (Number.isNaN(date.getTime())) return String(timeValue);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function mapDoctorProfileFromApi(doctor) {
  if (!doctor) return null;
  const notifications = doctor.notification_preferences || {
    email: true,
    sms: true,
    reminders: true,
    marketing: false,
  };

  return {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email || "",
    phone: doctor.phone || "",
    specialty: doctor.specialty || "",
    hospital: doctor.hospital || "",
    experience: String(doctor.experience_years ?? ""),
    consultationFee: String(doctor.fee ?? ""),
    languages: Array.isArray(doctor.languages)
      ? doctor.languages.join(", ")
      : doctor.languages || "",
    bio: doctor.about || "",
    slots: doctor.slots || [],
    online: doctor.online,
    notifications,
  };
}

export function mapDoctorProfileToApi(profile) {
  return {
    name: profile.name,
    phone: profile.phone,
    about: profile.bio,
    specialty: profile.specialty,
    hospital: profile.hospital,
    fee: profile.consultationFee,
    experience_years: profile.experience,
    languages: profile.languages,
    notification_preferences: profile.notifications,
  };
}

export function mapDoctorAppointmentFromApi(appointment, doctorOnline = true) {
  const consultationMode = appointment.consultation_mode || null;
  const isOnline =
    consultationMode === "online" || (!consultationMode && Boolean(appointment.meeting_id));
  const needsModeSelection = appointment.status === "confirmed" && !consultationMode;

  return {
    id: appointment.id,
    patient: appointment.customer?.name || "Unknown",
    type:
      consultationMode === "in_person"
        ? "In-Person"
        : consultationMode === "online"
        ? "Online Checkup"
        : needsModeSelection
        ? "Awaiting patient choice"
        : "Video Call",
    consultationMode,
    needsModeSelection,
    isOnline,
    isInPerson: consultationMode === "in_person",
    date: formatDate(appointment.appointment_date),
    time: appointment.slot,
    status: appointment.status,
    phone: appointment.customer?.phone || "",
    reason: appointment.reason || "",
    paymentStatus: appointment.payment_status,
    paymentMethod: appointment.payment_method,
    meetingId: appointment.meeting_id,
    meetingUrl: appointment.meeting_url,
    consultationNotes: appointment.consultation_notes,
    prescription: appointment.prescription,
    raw: appointment,
  };
}

export function mapDoctorPatientFromApi(patient) {
  return {
    id: patient.id,
    name: patient.name,
    email: patient.email || "",
    phone: patient.phone || "",
    lastVisit: formatDate(patient.lastVisit),
    condition: patient.condition || "General",
    appointmentsCount: patient.appointmentsCount || 1,
  };
}

export function mapLabProfileFromApi(lab) {
  if (!lab) return null;
  const notifications = lab.notification_preferences || {
    email: true,
    sms: true,
    newBookings: true,
    reportReady: true,
    cancellations: true,
  };

  let collectionCities = [];
  if (Array.isArray(lab.collection_areas || lab.collectionCities)) {
    collectionCities = lab.collection_areas || lab.collectionCities;
  } else if (typeof (lab.collection_areas || lab.collectionCities) === "string") {
    collectionCities = (lab.collection_areas || lab.collectionCities)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }

  return {
    id: lab.id,
    name: lab.name || "IDC",
    fullName: lab.fullName || lab.name || "IDC Diagnostics",
    email: lab.email || "",
    phone: lab.phone || "",
    address: lab.address || "",
    city: lab.city || "Islamabad",
    license: lab.license_number || lab.license || "",
    bio: lab.bio || "",
    homeCollection: lab.home_collection ?? lab.homeCollection ?? true,
    collectionFee: lab.collection_fee ?? lab.collectionFee ?? 0,
    freeDeliveryThreshold: lab.free_delivery_threshold ?? lab.freeDeliveryThreshold ?? 3000,
    operatingHours: lab.operating_hours || lab.operatingHours || {},
    collectionCities,
    notifications,
    raw: lab,
  };
}

export function mapLabProfileToApi(profile) {
  const collectionAreas = Array.isArray(profile.collectionCities)
    ? profile.collectionCities.join(", ")
    : profile.collectionAreas || profile.collectionCities || "";

  return {
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    license: profile.license,
    bio: profile.bio,
    homeCollection: profile.homeCollection,
    collectionFee: profile.collectionFee,
    operatingHours: profile.operatingHours,
    collectionAreas,
    notification_preferences: profile.notifications,
  };
}

export function mapLabBookingFromApi(booking) {
  if (!booking) return null;
  const address =
    typeof booking.collection_address === "object" && booking.collection_address !== null
      ? booking.collection_address?.street ||
        booking.collection_address?.line ||
        booking.collection_address?.address ||
        ""
      : booking.collection_address || "";

  const city =
    typeof booking.collection_address === "object" && booking.collection_address !== null
      ? booking.collection_address?.city || booking.collection_city || ""
      : booking.collection_city || "";

  const normStatus = normalizeStatus(booking.status);

  return {
    id: booking.id,
    booking_number: booking.booking_number || `MZ-${booking.id?.slice(0, 8)?.toUpperCase() || "2026-001"}`,
    patient: booking.patient_name || booking.customer?.name || "Patient",
    patient_name: booking.patient_name || booking.customer?.name || "Patient",
    patient_phone: booking.patient_phone || booking.customer?.phone || "",
    patient_email: booking.patient_email || booking.customer?.email || "",
    patient_gender: booking.patient_gender || "Not specified",
    patient_age: booking.patient_age || null,
    test: booking.test_name || booking.lab_test?.name || "Diagnostic Test",
    test_id: booking.test_id || booking.lab_test_id || booking.lab_test?.id,
    test_name: booking.test_name || booking.lab_test?.name || "Diagnostic Test",
    test_category: booking.test_category || booking.lab_test?.category || "General",
    test_price: Number(booking.test_price ?? booking.price ?? booking.lab_test?.price ?? 0),
    turnaround: booking.turnaround || booking.lab_test?.report_time || "24 hours",
    collection:
      booking.collection_type === "VISIT_LAB" || booking.collection_type === "Lab Visit"
        ? "Lab Visit"
        : "Home Collection",
    collection_type:
      booking.collection_type === "VISIT_LAB" || booking.collection_type === "Lab Visit"
        ? "Lab Visit"
        : "Home Collection",
    address: address || "Not provided",
    collection_address: address,
    collection_city: city,
    date: formatDate(booking.booking_date || booking.collection_date || booking.created_at),
    booking_date: booking.booking_date || booking.collection_date,
    time: booking.time_slot || "09:00 AM – 11:00 AM",
    time_slot: booking.time_slot || "09:00 AM – 11:00 AM",
    status: normStatus,
    payment_status: String(booking.payment_status || "UNPAID").toUpperCase(),
    payment_method: booking.payment_method || "Cash on Collection",
    collector_id: booking.collector_id || null,
    collector_name: booking.collector_name || "",
    collector_phone: booking.collector_phone || "",
    sample_collected_at: booking.sample_collected_at ? formatDate(booking.sample_collected_at) + " " + formatTime(booking.sample_collected_at) : null,
    processing_started_at: booking.processing_started_at ? formatDate(booking.processing_started_at) + " " + formatTime(booking.processing_started_at) : null,
    completed_at: booking.completed_at ? formatDate(booking.completed_at) + " " + formatTime(booking.completed_at) : null,
    report_file_name: booking.report_file_name || (booking.report_url ? "Diagnostic_Report.pdf" : null),
    report_url: booking.report_url || null,
    report_uploaded_at: booking.report_uploaded_at ? formatDate(booking.report_uploaded_at) + " " + formatTime(booking.report_uploaded_at) : null,
    report_notes: booking.report_notes || booking.notes || "",
    history: booking.history || [],
    created_at: booking.created_at,
    raw: booking,
  };
}

export function mapLabTestFromApi(test) {
  if (!test) return null;
  return {
    id: test.id,
    name: test.name,
    category: test.category || "General",
    description: test.description || "",
    price: Number(test.price || 0),
    discount_price: test.discount_price ? Number(test.discount_price) : null,
    turnaround: test.turnaround || test.report_time || "24 hours",
    sample_type: test.sample_type || "Blood",
    preparation_instructions: test.preparation_instructions || test.preparation || "No special preparation required.",
    fasting_required: Boolean(test.fasting_required),
    home_collection_supported: test.home_collection_supported ?? test.home_collection ?? true,
    status: test.status || (test.is_active ? "active" : "inactive"),
    created_at: test.created_at,
    raw: test,
  };
}

export function mapLabTestToApi(test) {
  return {
    name: test.name,
    category: test.category,
    description: test.description,
    price: Number(test.price),
    discount_price: test.discount_price ? Number(test.discount_price) : null,
    turnaround: test.turnaround,
    report_time: test.turnaround,
    sample_type: test.sample_type || "Blood",
    preparation_instructions: test.preparation_instructions,
    preparation: test.preparation_instructions,
    fasting_required: Boolean(test.fasting_required),
    home_collection_supported: Boolean(test.home_collection_supported),
    home_collection: Boolean(test.home_collection_supported),
    status: test.status || "active",
    is_active: test.status !== "inactive",
  };
}
