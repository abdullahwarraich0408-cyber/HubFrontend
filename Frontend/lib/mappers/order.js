import { DEFAULT_PRODUCT_IMAGE } from "./product";
import { getDoctorPhoto, mapDoctorAppointmentToFrontend } from "./doctor";
import { PRESCRIPTION_STATUS_LABELS, mapPrescriptionOrderToFrontend } from "./prescriptionOrder";

const LAB_TEST_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200&auto=format&fit=crop";

function formatOrderDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAddress(value) {
  if (!value) return "Address on file";
  if (typeof value === "string") return value;
  return value.street || value.address || value.city || "Address on file";
}

function normalizeMedicineStatus(status) {
  return status || "pending";
}

function normalizeDoctorStatus(status) {
  if (status === "completed") return "delivered";
  if (status === "cancelled") return "cancelled";
  if (["confirmed", "in_progress"].includes(status)) return "processing";
  return "pending";
}

function normalizeLabStatus(status) {
  if (status === "completed" || status === "report_uploaded") return "delivered";
  if (status === "cancelled" || status === "rejected") return "cancelled";
  if (["confirmed", "collector_assigned", "sample_collected", "testing"].includes(status)) {
    return "processing";
  }
  return "pending";
}

function buildLabTracking(status, collectionDate, timeSlot, booking = {}) {
  const dateLabel = formatOrderDate(collectionDate);
  const steps = [
    { key: "pending", step: "Test Booked", time: dateLabel },
    { key: "confirmed", step: "Lab Confirmed", time: dateLabel },
    { key: "collector_assigned", step: "Collector Assigned", time: booking.collector_name || "Pending" },
    {
      key: "sample_collected",
      step: "Sample Collected",
      time: timeSlot ? `${dateLabel} · ${timeSlot}` : dateLabel,
    },
    { key: "testing", step: "Testing in Lab", time: "In progress" },
    { key: "report_uploaded", step: "Report Uploaded", time: "Ready" },
    { key: "completed", step: "Completed", time: dateLabel },
  ];

  const order = steps.map((s) => s.key);
  const currentIndex = order.indexOf(status);

  return steps.map((s, index) => ({
    step: s.step,
    time: s.time,
    done: currentIndex >= 0 ? index <= currentIndex : index === 0,
  }));
}

const MEDICINE_STEPS = ["pending", "processing", "shipped", "delivered"];

function buildMedicineTracking(status, createdAt) {
  const currentIndex = MEDICINE_STEPS.indexOf(normalizeMedicineStatus(status));
  const dateLabel = formatOrderDate(createdAt);

  return [
    { step: "Order Placed", time: dateLabel, done: currentIndex >= 0 },
    { step: "Confirmed", time: dateLabel, done: currentIndex >= 1 },
    { step: "Packed", time: dateLabel, done: currentIndex >= 1 },
    { step: "Out for Delivery", time: dateLabel, done: currentIndex >= 2 },
    { step: "Delivered", time: status === "delivered" ? dateLabel : "Pending", done: currentIndex >= 3 },
  ];
}

function buildDoctorTracking(status, createdAt, consultationMode) {
  const normalized = normalizeDoctorStatus(status);
  const dateLabel = formatOrderDate(createdAt);
  const isOnline = consultationMode === "online";
  const consultationDone = normalized === "delivered" || status === "in_progress";

  return [
    { step: "Appointment Booked", time: dateLabel, done: true },
    { step: "Payment Confirmed", time: dateLabel, done: normalized !== "pending" },
    {
      step: isOnline ? "Video Consultation" : "Clinic Visit",
      time: consultationDone ? dateLabel : "Scheduled",
      done: consultationDone,
    },
    {
      step: "Prescription",
      time: normalized === "delivered" ? dateLabel : "After consultation",
      done: normalized === "delivered",
    },
  ];
}

export function parseOrderRef(orderRef) {
  if (!orderRef) return { type: "medicines", id: "" };
  if (orderRef.startsWith("doc-")) return { type: "doctor", id: orderRef.slice(4) };
  if (orderRef.startsWith("lab-")) return { type: "lab", id: orderRef.slice(4) };
  if (orderRef.startsWith("rx-")) return { type: "prescription", id: orderRef.slice(3) };
  if (orderRef.startsWith("med-")) return { type: "medicines", id: orderRef.slice(4) };
  return { type: "medicines", id: orderRef };
}

export function buildOrderRef(type, id) {
  if (type === "doctor") return `doc-${id}`;
  if (type === "lab") return `lab-${id}`;
  if (type === "prescription") return `rx-${id}`;
  return `med-${id}`;
}

export function mapMedicineOrderToFrontend(order) {
  if (!order) return null;

  return {
    id: buildOrderRef("medicines", order.id),
    sourceId: order.id,
    type: "medicines",
    title: "Medicine Order",
    date: formatOrderDate(order.created_at),
    sortDate: order.created_at,
    status: normalizeMedicineStatus(order.status),
    rawStatus: order.status,
    total: order.total_amount,
    vendor: order.vendor?.business_name || "Pharmacy",
    items:
      order.items?.map((item) => ({
        name: item.product?.name || item.name || "Product",
        qty: item.quantity,
        price: item.unit_price ?? item.price ?? 0,
        img: item.product?.image_url || DEFAULT_PRODUCT_IMAGE,
      })) || [],
    tracking: buildMedicineTracking(order.status, order.created_at),
    deliveryAddress: formatAddress(order.delivery_address),
    reorderHref: "/browse",
  };
}

export function mapDoctorAppointmentToOrder(appointment) {
  if (!appointment) return null;

  const mapped = mapDoctorAppointmentToFrontend(appointment);
  const doctorName = appointment.doctor?.name || appointment.doctorName || "Doctor";
  const specialty = appointment.doctor?.specialty || appointment.specialty;
  const consultationMode =
    appointment.consultation_mode || appointment.consultationMode || mapped.preferredMode;
  const isOnline = mapped.isOnline || consultationMode === "online";
  const createdAt = appointment.created_at || appointment.dateIso || appointment.appointment_date;

  return {
    id: buildOrderRef("doctor", appointment.id),
    sourceId: appointment.id,
    type: "doctor",
    title: "Doctor Appointment",
    date: formatOrderDate(appointment.appointment_date || createdAt),
    sortDate: appointment.appointment_date || createdAt,
    status: normalizeDoctorStatus(appointment.status),
    rawStatus: appointment.status,
    total: appointment.fee ?? 0,
    vendor: doctorName,
    specialty,
    slot: appointment.slot,
    paymentStatus: appointment.payment_status || mapped.paymentStatus,
    consultationMode,
    isOnline,
    canJoin: mapped.canJoin,
    canChat: mapped.canChat,
    canViewChat: mapped.canViewChat,
    chatReadOnly: mapped.chatReadOnly,
    meetingId: mapped.meetingId,
    items: [
      {
        name: `${isOnline ? "Online Consultation" : "In-Clinic Appointment"} — ${doctorName}`,
        qty: 1,
        price: appointment.fee ?? 0,
        img: getDoctorPhoto(appointment.doctor?.photo_url || appointment.doctorPhoto),
      },
    ],
    tracking: buildDoctorTracking(appointment.status, createdAt, consultationMode),
    deliveryAddress: isOnline
      ? "Online — Video consultation"
      : appointment.doctor?.hospital || appointment.hospital || "Clinic visit",
    reorderHref: "/doctors",
    prescriptionAvailable: Boolean(appointment.prescription),
    detailHref: `/account/appointments`,
    appointmentsHref: "/account/appointments",
    chatHref: mapped.canViewChat ? `/account/appointments/${appointment.id}/chat` : null,
    consultationHref:
      isOnline &&
      ["confirmed", "in_progress"].includes(appointment.status) &&
      mapped.meetingId &&
      !mapped.needsModeSelection
        ? `/consultation/${mapped.meetingId}?appointment=${appointment.id}`
        : null,
  };
}

export function mapLabBookingToOrder(booking) {
  if (!booking) return null;

  const testName = booking.lab_test?.name || booking.testName || "Lab Test";
  const createdAt = booking.created_at || booking.collection_date;

  return {
    id: buildOrderRef("lab", booking.id),
    sourceId: booking.id,
    type: "lab",
    title: "Lab Test",
    date: formatOrderDate(booking.collection_date || createdAt),
    sortDate: booking.collection_date || createdAt,
    status: normalizeLabStatus(booking.status),
    rawStatus: booking.status,
    total: booking.price ?? 0,
    vendor: booking.lab_test?.lab || booking.lab || "Lab Partner",
    testName,
    slot: booking.time_slot || booking.timeSlot,
    items: [
      {
        name: testName,
        qty: 1,
        price: booking.price ?? 0,
        img: LAB_TEST_IMAGE,
      },
    ],
    tracking: buildLabTracking(
      booking.status,
      booking.collection_date,
      booking.time_slot || booking.timeSlot,
      booking
    ),
    deliveryAddress: formatAddress(booking.collection_address || booking.address),
    reorderHref: "/lab-tests",
    reportAvailable: Boolean(booking.report_url),
    reportUrl: booking.report_url,
    canCancel: !["cancelled", "completed", "report_uploaded", "rejected"].includes(booking.status),
  };
}

function normalizePrescriptionStatus(status) {
  if (status === "delivered") return "delivered";
  if (status === "cancelled" || status === "no_vendor") return "cancelled";
  if (["packed", "rider_assigned", "out_for_delivery"].includes(status)) return "shipped";
  if (["finding_vendor", "awaiting_accept", "accepted", "stock_pending", "stock_confirmed", "customer_review", "confirmed"].includes(status)) {
    return "processing";
  }
  return "pending";
}

function buildPrescriptionTracking(order) {
  const mapped = mapPrescriptionOrderToFrontend(order);
  if (!mapped) return [];
  return mapped.statusTimeline;
}

export function mapPrescriptionOrderToOrder(order) {
  const mapped = mapPrescriptionOrderToFrontend(order);
  if (!mapped) return null;

  const vendorName =
    mapped.assignedVendor?.name ||
    mapped.currentVendor?.name ||
    (mapped.status === "no_vendor" ? "No pharmacy accepted" : "Finding pharmacy...");

  return {
    id: buildOrderRef("prescription", mapped.id),
    sourceId: mapped.id,
    type: "prescription",
    title: "Prescription Order",
    date: formatOrderDate(mapped.createdAt),
    sortDate: mapped.createdAt,
    status: normalizePrescriptionStatus(mapped.status),
    rawStatus: mapped.status,
    statusLabel: mapped.statusLabel,
    total: mapped.estimatedValue || 0,
    vendor: vendorName,
    items: mapped.items.map((item) => ({
      name: item.name,
      qty: item.quantity,
      price: item.unitPrice,
      img: DEFAULT_PRODUCT_IMAGE,
    })),
    tracking: buildPrescriptionTracking(order),
    deliveryAddress: formatAddress(mapped.deliveryAddress),
    detailHref: `/prescription/${mapped.id}`,
    reorderHref: "/",
    assignmentHistory: mapped.assignmentHistory,
    assignedVendor: mapped.assignedVendor,
    currentVendor: mapped.currentVendor,
  };
}

export function mergeAllOrders(medicineOrders = [], appointments = [], labBookings = [], prescriptionOrders = []) {
  const merged = [
    ...medicineOrders.map(mapMedicineOrderToFrontend).filter(Boolean),
    ...appointments.map(mapDoctorAppointmentToOrder).filter(Boolean),
    ...labBookings.map(mapLabBookingToOrder).filter(Boolean),
    ...prescriptionOrders.map(mapPrescriptionOrderToOrder).filter(Boolean),
  ];

  return merged.sort((a, b) => new Date(b.sortDate || 0) - new Date(a.sortDate || 0));
}

export function mapOrderToFrontend(order) {
  return mapMedicineOrderToFrontend(order);
}

export function mapOrdersToFrontend(orders = []) {
  return orders.map(mapMedicineOrderToFrontend).filter(Boolean);
}
