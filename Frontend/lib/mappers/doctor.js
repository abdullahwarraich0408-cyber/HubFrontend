export const DEFAULT_DOCTOR_PHOTO =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400";

export function getDoctorPhoto(photoUrl) {
  const value = photoUrl && String(photoUrl).trim();
  return value || DEFAULT_DOCTOR_PHOTO;
}

function flattenDoctorSlots(slots) {
  if (!Array.isArray(slots) || slots.length === 0) return [];
  if (typeof slots[0] === "string") return slots;
  return slots.flatMap((entry) => (Array.isArray(entry?.slots) ? entry.slots : []));
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getNextAvailableFromSchedule(schedule = []) {
  const activeDays = new Set(
    schedule.filter((entry) => entry.slots?.length).map((entry) => entry.day)
  );
  if (!activeDays.size) return null;

  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let offset = 0; offset < 21; offset += 1) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + offset);
    if (activeDays.has(WEEKDAYS[candidate.getDay()])) {
      return candidate;
    }
  }
  return null;
}

function formatLocationAvailability(date) {
  if (!date) return "No upcoming slots";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Available today";
  if (diffDays === 1) return "Available tomorrow";
  return `Available ${target.toLocaleDateString("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}`;
}

function mapPracticeLocation(location) {
  if (!location) return null;
  const hospital = location.hospital;
  const schedule = Array.isArray(location.schedule) ? location.schedule : [];
  const days = schedule.filter((entry) => entry.slots?.length).map((entry) => entry.day);
  const nextDate = getNextAvailableFromSchedule(schedule);

  return {
    id: location.id,
    hospitalId: location.hospital_id,
    clinicName: location.clinic_name,
    title: location.title || hospital?.name || location.clinic_name || "Clinic",
    address:
      location.address ||
      (hospital?.address
        ? `${hospital.address}${hospital.city ? `, ${hospital.city}` : ""}`
        : hospital?.city || null),
    fee: location.fee,
    days,
    schedule,
    availability: location.availability || formatLocationAvailability(nextDate),
    nextAvailableDate: location.next_available_date || (nextDate ? nextDate.toISOString().slice(0, 10) : null),
    hospitalData: hospital
      ? {
          id: hospital.id,
          name: hospital.name,
          slug: hospital.slug,
          city: hospital.city,
          logo: hospital.logo,
          address: hospital.address,
        }
      : null,
  };
}

export function mapDoctorToFrontend(doctor) {
  if (!doctor) return null;

  const weeklySchedule = Array.isArray(doctor.slots) && doctor.slots[0]?.day
    ? doctor.slots
    : [];

  const practiceLocations = (doctor.practice_locations || []).map(mapPracticeLocation).filter(Boolean);

  const primaryLocation = practiceLocations[0];
  const hospitalName =
    primaryLocation?.title ||
    doctor.hospital_ref?.name ||
    doctor.hospital ||
    "Independent Practice";

  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    experience: `${doctor.experience_years} years`,
    experienceYears: doctor.experience_years,
    rating: doctor.rating,
    reviews: doctor.reviews_count,
    fee: doctor.fee,
    online: doctor.online,
    availableToday: doctor.available_today,
    languages: Array.isArray(doctor.languages) ? doctor.languages : [],
    photo: getDoctorPhoto(doctor.photo_url),
    slots: weeklySchedule,
    displaySlots: flattenDoctorSlots(doctor.slots),
    about: doctor.about,
    qualifications: Array.isArray(doctor.qualifications) ? doctor.qualifications : [],
    hospital: hospitalName,
    hospitalId: primaryLocation?.hospitalId || doctor.hospital_id || doctor.hospital_ref?.id || null,
    hospitalData: primaryLocation?.hospitalData ||
      (doctor.hospital_ref
        ? {
            id: doctor.hospital_ref.id,
            name: doctor.hospital_ref.name,
            slug: doctor.hospital_ref.slug,
            city: doctor.hospital_ref.city,
            logo: doctor.hospital_ref.logo,
            address: doctor.hospital_ref.address,
          }
        : null),
    practiceLocations,
    isIndependent: practiceLocations.length === 0 && !doctor.hospital_id,
  };
}

export function mapDoctorsToFrontend(doctors = []) {
  return doctors.map(mapDoctorToFrontend).filter(Boolean);
}

export function mapDoctorReviewToFrontend(review) {
  return {
    id: review.id,
    author: review.author_name,
    rating: review.rating,
    date: review.created_at
      ? new Date(review.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : review.date,
    text: review.comment || review.text,
  };
}

export function mapDoctorReviewsToFrontend(reviews = []) {
  return reviews.map(mapDoctorReviewToFrontend);
}

function resolveIsOnlineAppointment(appointment) {
  const consultationMode = appointment.consultation_mode || null;
  const preferredMode = appointment.preferred_consultation_mode || null;
  if (consultationMode === "in_person") return false;
  if (consultationMode === "online") return true;
  if (preferredMode === "online") return true;
  return Boolean(appointment.meeting_id);
}

export function mapDoctorAppointmentToFrontend(appointment) {
  const date = appointment.appointment_date ? new Date(appointment.appointment_date) : null;
  const consultationMode = appointment.consultation_mode || null;
  const preferredMode = appointment.preferred_consultation_mode || null;
  const isOnline = resolveIsOnlineAppointment(appointment);
  const needsModeSelection =
    appointment.status === "confirmed" && !consultationMode && !preferredMode;
  const activeStatuses = ["confirmed", "in_progress"];
  const chatStatuses = ["confirmed", "in_progress", "completed"];
  const hasMeeting = Boolean(appointment.meeting_id);

  return {
    id: appointment.id,
    doctorId: appointment.doctor_id,
    doctorName: appointment.doctor?.name,
    specialty: appointment.doctor?.specialty,
    doctorPhoto: appointment.doctor?.photo_url,
    hospital: appointment.doctor?.hospital,
    slot: appointment.slot,
    date: date
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    dateIso: appointment.appointment_date,
    fee: appointment.fee,
    status: appointment.status,
    paymentMethod: appointment.payment_method,
    paymentStatus: appointment.payment_status,
    reason: appointment.reason,
    consultationMode,
    preferredMode,
    needsModeSelection,
    isOnline,
    isInPerson: consultationMode === "in_person",
    meetingId: appointment.meeting_id,
    meetingUrl: appointment.meeting_url,
    consultationNotes: appointment.consultation_notes,
    prescription: appointment.prescription,
    review: appointment.review,
    canReview: appointment.status === "completed" && !appointment.review,
    canJoin:
      activeStatuses.includes(appointment.status) &&
      isOnline &&
      !needsModeSelection &&
      hasMeeting,
    canChat:
      chatStatuses.includes(appointment.status) && isOnline && !needsModeSelection,
    canViewChat:
      appointment.status !== "cancelled" &&
      isOnline &&
      (chatStatuses.includes(appointment.status) ||
        (appointment.status === "pending" && preferredMode === "online")),
    chatReadOnly: appointment.status === "completed",
    raw: appointment,
  };
}

export function mapDoctorAppointmentsToFrontend(appointments = []) {
  return appointments.map(mapDoctorAppointmentToFrontend);
}

export function mapPrescriptionToFrontend(prescription) {
  if (!prescription) return null;
  return {
    id: prescription.id,
    appointmentId: prescription.appointment_id,
    items: Array.isArray(prescription.items) ? prescription.items : [],
    notes: prescription.notes,
    createdAt: prescription.created_at,
  };
}
