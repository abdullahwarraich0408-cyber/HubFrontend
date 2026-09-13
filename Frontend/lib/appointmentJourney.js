/**
 * Shared appointment journey helpers (presentation only — no new status machine).
 */

export function normalizeMode(appointment) {
  const mode = String(
    appointment?.consultationMode ||
      appointment?.consultation_mode ||
      appointment?.preferredMode ||
      appointment?.preferred_consultation_mode ||
      "",
  ).toLowerCase();
  if (mode === "in_person" || mode === "in_clinic") return "in_person";
  if (mode === "online") return "online";
  if (appointment?.isInPerson) return "in_person";
  if (appointment?.isOnline) return "online";
  return "online";
}

export function formatAppointmentStatusLabel(status) {
  const map = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "Missed Appointment",
  };
  return map[status] || String(status || "").replace(/_/g, " ");
}

export function formatPaymentLabel(appointment) {
  const status = String(appointment?.paymentStatus || appointment?.payment_status || "").toLowerCase();
  const method = String(appointment?.paymentMethod || appointment?.payment_method || "").toLowerCase();

  if (status === "paid") {
    if (method === "pay_at_clinic" || method === "cod" || method === "cash") return "Paid at Clinic";
    return "Paid Online";
  }
  if (status === "pay_at_clinic") return "Pay at Clinic";
  if (status === "pending") return "Payment Pending";
  if (status === "failed") return "Payment Failed";
  if (status === "refunded") return "Refunded";
  if (status === "partially_refunded") return "Partially Refunded";
  return status ? status.replace(/_/g, " ") : "Payment Pending";
}

export function formatFollowUpStatusLabel(status) {
  const map = {
    planned: "Follow-up Recommended",
    notified: "Follow-up Recommended",
    booked: "Follow-up Booked",
    needs_rebooking: "Follow-up Needs Rebooking",
    overdue: "Follow-up Overdue",
    completed: "Follow-up Completed",
    cancelled: "Follow-up Cancelled",
    declined: "Follow-up Declined",
  };
  return map[status] || String(status || "").replace(/_/g, " ");
}

function paymentStepDone(appointment) {
  const status = String(appointment?.paymentStatus || appointment?.payment_status || "").toLowerCase();
  return status === "paid" || status === "pay_at_clinic";
}

function hasPrescription(appointment) {
  return Boolean(appointment?.prescription || appointment?.raw?.prescription);
}

/**
 * @returns {{ id: string, label: string, state: 'completed'|'current'|'upcoming'|'terminated' }[]}
 */
export function buildPatientTimeline(appointment, options = {}) {
  const status = String(appointment?.status || "").toLowerCase();
  const mode = normalizeMode(appointment);
  const terminal = status === "cancelled" || status === "no_show";
  const followUp = options.followUp || null;
  const hasFollowUp = Boolean(followUp);
  const chatAvailable = Boolean(appointment?.canChat || appointment?.canViewChat);
  const joinAvailable = Boolean(appointment?.canJoin);

  const steps =
    mode === "in_person"
      ? [
          { id: "booked", label: "Booking received" },
          { id: "payment", label: "Payment / Pay at Clinic" },
          { id: "confirmed", label: "Doctor confirmed" },
          { id: "prepare", label: "Prepare for clinic visit" },
          { id: "checked_in", label: "Checked in" },
          { id: "in_progress", label: "Consultation in progress" },
          { id: "completed", label: "Completed" },
          { id: "prescription", label: "Prescription ready" },
          ...(hasFollowUp ? [{ id: "follow_up", label: "Follow-up recommended" }] : []),
        ]
      : [
          { id: "booked", label: "Booking received" },
          { id: "payment", label: "Payment" },
          { id: "confirmed", label: "Doctor confirmed" },
          { id: "prepare", label: "Prepare for consultation" },
          { id: "chat", label: "Chat available" },
          { id: "join", label: "Join available" },
          { id: "in_progress", label: "Consultation in progress" },
          { id: "completed", label: "Completed" },
          { id: "prescription", label: "Prescription ready" },
          ...(hasFollowUp ? [{ id: "follow_up", label: "Follow-up recommended" }] : []),
        ];

  const rank = {
    booked: 0,
    payment: paymentStepDone(appointment) ? 1 : status === "pending" ? 0.5 : 1,
    confirmed: ["confirmed", "checked_in", "in_progress", "completed"].includes(status) ? 2 : 1,
    prepare: ["confirmed", "checked_in", "in_progress", "completed"].includes(status) ? 3 : 2,
    chat: chatAvailable || ["in_progress", "completed"].includes(status) ? 4 : 3,
    join: joinAvailable || ["in_progress", "completed"].includes(status) ? 5 : 4,
    checked_in: ["checked_in", "in_progress", "completed"].includes(status) ? 4 : 3,
    in_progress: ["in_progress", "completed"].includes(status) ? (mode === "in_person" ? 5 : 6) : 5,
    completed: status === "completed" ? 7 : 6,
    prescription: status === "completed" && hasPrescription(appointment) ? 8 : 7,
    follow_up: status === "completed" && hasFollowUp ? 9 : 8,
  };

  let currentId = "booked";
  if (terminal) {
    currentId = status === "no_show" ? "confirmed" : "confirmed";
  } else if (status === "pending") {
    currentId = paymentStepDone(appointment) ? "confirmed" : "payment";
  } else if (status === "confirmed") {
    if (mode === "online") {
      if (joinAvailable) currentId = "join";
      else if (chatAvailable) currentId = "chat";
      else currentId = "prepare";
    } else {
      currentId = "prepare";
    }
  } else if (status === "checked_in") {
    currentId = "checked_in";
  } else if (status === "in_progress") {
    currentId = "in_progress";
  } else if (status === "completed") {
    if (hasFollowUp) currentId = "follow_up";
    else if (hasPrescription(appointment)) currentId = "prescription";
    else currentId = "completed";
  }

  const currentIndex = steps.findIndex((s) => s.id === currentId);

  return steps.map((step, index) => {
    if (terminal) {
      const terminateAt = steps.findIndex((s) => s.id === "confirmed");
      if (index <= Math.max(terminateAt, 1)) {
        return { ...step, state: index < terminateAt ? "completed" : "terminated" };
      }
      return { ...step, state: "upcoming" };
    }
    if (index < currentIndex) return { ...step, state: "completed" };
    if (index === currentIndex) return { ...step, state: "current" };
    // Mark payment completed when paid even if still pending confirm
    if (step.id === "payment" && paymentStepDone(appointment)) {
      return { ...step, state: "completed" };
    }
    if (step.id === "prescription" && hasPrescription(appointment) && status === "completed") {
      return { ...step, state: "completed" };
    }
    return { ...step, state: "upcoming" };
  });
}

export function buildDoctorTimeline(appointment, options = {}) {
  const status = String(appointment?.status || "").toLowerCase();
  const mode = normalizeMode(appointment);
  const terminal = status === "cancelled" || status === "no_show";
  const followUp = options.followUp || appointment?.followUp || null;
  const hasFollowUp = Boolean(followUp || options.hasFollowUp);
  const hasRx = hasPrescription(appointment);

  const steps = [
    { id: "booked", label: "Booked" },
    { id: "payment", label: "Payment" },
    { id: "confirmed", label: "Confirmed" },
    ...(mode === "in_person" ? [{ id: "checked_in", label: "Checked In" }] : []),
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "prescription", label: "Prescription" },
    ...(hasFollowUp ? [{ id: "follow_up", label: "Follow-up" }] : []),
  ];

  let currentId = "booked";
  if (status === "pending") currentId = paymentStepDone(appointment) ? "confirmed" : "payment";
  else if (status === "confirmed") currentId = "confirmed";
  else if (status === "checked_in") currentId = "checked_in";
  else if (status === "in_progress") currentId = "in_progress";
  else if (status === "completed") {
    if (hasFollowUp) currentId = "follow_up";
    else if (hasRx) currentId = "prescription";
    else currentId = "completed";
  }

  const currentIndex = steps.findIndex((s) => s.id === currentId);

  return steps.map((step, index) => {
    if (terminal) {
      const terminateAt = steps.findIndex((s) => s.id === "confirmed");
      if (index <= Math.max(terminateAt, 1)) {
        return { ...step, state: index < terminateAt ? "completed" : "terminated" };
      }
      return { ...step, state: "upcoming" };
    }
    if (step.id === "payment" && paymentStepDone(appointment) && index !== currentIndex) {
      return { ...step, state: index < currentIndex ? "completed" : "completed" };
    }
    if (index < currentIndex) return { ...step, state: "completed" };
    if (index === currentIndex) return { ...step, state: "current" };
    return { ...step, state: "upcoming" };
  });
}
