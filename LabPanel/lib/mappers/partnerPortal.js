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
    type: consultationMode === "in_person"
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
    marketing: false,
  };

  return {
    id: lab.id,
    name: lab.name,
    email: lab.email || "",
    phone: lab.phone || "",
    address: lab.address || "",
    license: lab.license_number || "",
    bio: lab.bio || "",
    homeCollection: lab.home_collection ?? true,
    operatingHours: lab.operating_hours || "",
    collectionAreas: lab.collection_areas || "",
    notifications,
  };
}

export function mapLabProfileToApi(profile) {
  return {
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    license: profile.license,
    bio: profile.bio,
    homeCollection: profile.homeCollection,
    operatingHours: profile.operatingHours,
    collectionAreas: profile.collectionAreas,
    notification_preferences: profile.notifications,
  };
}

export function mapLabBookingFromApi(booking) {
  const address =
    typeof booking.collection_address === "object"
      ? booking.collection_address?.street || booking.collection_address?.line || booking.collection_address?.address || ""
      : booking.collection_address || "";

  return {
    id: booking.id,
    patient: booking.patient_name || booking.customer?.name || "Unknown",
    test: booking.lab_test?.name || "Lab Test",
    collection: booking.collection_type === "VISIT_LAB" ? "Lab Visit" : "Home",
    date: formatDate(booking.collection_date),
    time: booking.time_slot,
    status: booking.status,
    phone: booking.customer?.phone || booking.collector_phone || "",
    address,
    raw: booking,
  };
}

export function mapLabTestFromApi(test) {
  return {
    id: test.id,
    name: test.name,
    category: test.category,
    price: test.price,
    turnaround: test.report_time,
    status: test.is_active ? "active" : "inactive",
  };
}

export function mapLabTestToApi(test) {
  return {
    name: test.name,
    category: test.category,
    price: test.price,
    turnaround: test.turnaround,
    status: test.status,
    description: test.description,
  };
}
