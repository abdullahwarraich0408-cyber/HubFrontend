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

export function mapDoctorToFrontend(doctor) {
  if (!doctor) return null;

  const weeklySchedule = Array.isArray(doctor.slots) && doctor.slots[0]?.day
    ? doctor.slots
    : [];

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
    hospital: doctor.hospital,
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

export function mapDoctorAppointmentToFrontend(appointment) {
  const date = appointment.appointment_date ? new Date(appointment.appointment_date) : null;

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
    meetingId: appointment.meeting_id,
    meetingUrl: appointment.meeting_url,
    consultationNotes: appointment.consultation_notes,
    prescription: appointment.prescription,
    review: appointment.review,
    canReview: appointment.status === "completed" && !appointment.review,
    canJoin: ["confirmed", "in_progress"].includes(appointment.status),
    canChat: ["confirmed", "in_progress", "completed"].includes(appointment.status),
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
