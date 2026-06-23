import { api } from "./client";
import { setPartnerSession, clearPartnerSession } from "../partnerAuth";

export const partnerAuthApi = {
  login: async (portal, email, password) => {
    const data = await api.post("/auth/partner/login", { portal, email, password });
    if (data.tokens) {
      setPartnerSession({
        tokens: data.tokens,
        role: data.role,
        partner: data.partner,
      });
    }
    return data;
  },
  logout: () => {
    clearPartnerSession();
  },
};

export const doctorPortalApi = {
  getProfile: () => api.get("/partners/doctor/profile"),
  updateProfile: (data) => api.patch("/partners/doctor/profile", data),
  updatePassword: (current, newPassword) =>
    api.patch("/partners/doctor/password", { current, new: newPassword }),
  getAppointments: () => api.get("/partners/doctor/appointments"),
  updateAppointmentStatus: (id, status, notes) =>
    api.patch(`/partners/doctor/appointments/${id}/status`, { status, notes }),
  getSchedule: () => api.get("/partners/doctor/schedule"),
  updateSchedule: (slots) => api.put("/partners/doctor/schedule", { slots }),
  getHospitals: () => api.get("/partners/doctor/hospitals"),
  getPracticeLocations: () => api.get("/partners/doctor/practice-locations"),
  createPracticeLocation: (data) => api.post("/partners/doctor/practice-locations", data),
  updatePracticeLocation: (locationId, data) =>
    api.patch(`/partners/doctor/practice-locations/${locationId}`, data),
  deletePracticeLocation: (locationId) => api.delete(`/partners/doctor/practice-locations/${locationId}`),
  getPatients: () => api.get("/partners/doctor/patients"),
  getStats: () => api.get("/partners/doctor/stats"),
  createPrescription: (data) => api.post("/partners/doctor/prescriptions", data),
  getPrescription: (appointmentId) => api.get(`/partners/doctor/prescriptions/${appointmentId}`),
};

export const labPortalApi = {
  getProfile: () => api.get("/partners/lab/profile"),
  updateProfile: (data) => api.patch("/partners/lab/profile", data),
  updatePassword: (current, newPassword) =>
    api.patch("/partners/lab/password", { current, new: newPassword }),
  getBookings: () => api.get("/partners/lab/bookings"),
  updateBookingStatus: (id, status, note) =>
    api.patch(`/partners/lab/bookings/${id}/status`, { status, note }),
  assignCollector: (id, data) => api.patch(`/partners/lab/bookings/${id}/collector`, data),
  uploadReport: (id, reportUrl) =>
    api.patch(`/partners/lab/bookings/${id}/report`, { report_url: reportUrl }),
  uploadReportFile: (id, file) => {
    const formData = new FormData();
    formData.append("report", file);
    return api.post(`/partners/lab/bookings/${id}/report-file`, formData);
  },
  getTests: () => api.get("/partners/lab/tests"),
  createTest: (data) => api.post("/partners/lab/tests", data),
  updateTest: (id, data) => api.patch(`/partners/lab/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/partners/lab/tests/${id}`),
  getReportsSummary: () => api.get("/partners/lab/reports/summary"),
};

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),
};

export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(query ? `/products?${query}` : "/products");
  },
  getAdminAll: () => api.get("/admin/products"),
  getById: (id) => api.get(`/products/${id}`),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const vendorsApi = {
  getAll: (params = {}) => {
    // If requesting all vendors (including pending), it must go through the protected admin route
    if (params.all) {
      return api.get("/admin/vendors");
    }
    const query = new URLSearchParams(params).toString();
    return api.get(query ? `/vendors?${query}` : "/vendors");
  },
  getById: (id) => api.get(`/vendors/${id}`),
  getReviews: (id) => api.get(`/vendors/${id}/reviews`),
  getProfile: () => api.get("/vendors/profile"),
  updateProfile: (data) => api.patch("/vendors/profile", data),
  getMyProducts: () => api.get("/vendors/products/mine"),
  getDashboardStats: () => api.get("/vendors/dashboard/stats"),
  register: (data) => api.post("/vendors/register", data),
  updateStatus: (id, status, note) => api.patch(`/admin/vendors/${id}/status`, { status, note }),
  updateCredentials: (id, data) =>
    api.patch(`/admin/vendors/${id}/credentials`, data),
  delete: (id) => api.delete(`/admin/vendors/${id}`),
};

export const inventoryApi = {
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/vendor/inventory/bulk", formData);
  },
};

export const cartApi = {
  get: () => api.get("/customer/cart"),
  addItem: (product_id, quantity = 1) =>
    api.post("/customer/cart", { product_id, quantity }),
  updateItem: (itemId, quantity) =>
    api.put(`/customer/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/customer/cart/${itemId}`),
  merge: (items) => api.post("/customer/cart/merge", { items }),
  clear: () => api.delete("/cart"),
};

export const ordersApi = {
  getAll: () => api.get("/orders"),
  getAdminAll: () => api.get("/admin/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  getVendorOrders: () => api.get("/orders/vendor"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const usersApi = {
  getProfile: () => api.get("/users/profile"),
  getAdminCustomers: () => api.get("/admin/customers"),
  updateProfile: (data) => api.patch("/users/profile", data),
  updateNotificationPreferences: (data) =>
    api.post("/notifications/preferences", data),
};

export const marketingApi = {
  getCoupons: () => api.get("/admin/marketing/coupons"),
  createCoupon: (data) => api.post("/admin/marketing/coupons", data),
  deleteCoupon: (id) => api.delete(`/admin/marketing/coupons/${id}`),
  getOffers: () => api.get("/admin/marketing/offers"),
};

export const addressesApi = {
  getAll: () => api.get("/addresses"),
  create: (data) => api.post("/addresses", data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
};

export const searchApi = {
  search: (q) => api.get(q ? `/search?q=${encodeURIComponent(q)}` : "/search"),
  autocomplete: (q) =>
    api.get(`/search/autocomplete?q=${encodeURIComponent(q)}`),
  trending: () => api.get("/search/trending"),
  filters: () => api.get("/search/filters"),
  advanced: (body) => api.post("/search/advanced", body),
};

export const categoriesApi = {
  getAll: () => api.get("/categories"),
};

export const couponsApi = {
  getApplicable: () => api.get("/customer/coupons"),
  validate: (code, orderAmount) =>
    api.get(`/coupons/${code}?orderAmount=${orderAmount}`),
};

export const prescriptionsApi = {
  getAll: () => api.get("/customer/prescriptions"),
  upload: (file) => {
    const formData = new FormData();
    formData.append("prescriptionFile", file);
    return api.post("/prescriptions/upload", formData);
  },
};

export const uploadApi = {
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append("document", file);
    return api.post("/upload/document", formData);
  },
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/image", formData);
  },
};

export const paymentsApi = {
  checkout: (data) => api.post("/payments/checkout", data),
  verifyStripeSession: (sessionId) =>
    api.get(`/payments/stripe/verify?session_id=${encodeURIComponent(sessionId)}`),
};

export const reviewsApi = {
  submit: (data) => api.post("/reviews", data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const healthApi = {
  check: () => api.get("/health"),
};

export const doctorsApi = {
  getFilters: () => api.get("/doctors/filters"),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(query ? `/doctors?${query}` : "/doctors");
  },
  getById: (id) => api.get(`/doctors/${id}`),
  getReviews: (id) => api.get(`/doctors/${id}/reviews`),
  getSlots: (id, date) => {
    const query = date ? `?date=${encodeURIComponent(date)}` : "";
    return api.get(`/doctors/${id}/slots${query}`);
  },
  bookAppointment: (data) => api.post("/doctors/appointments", data, { auth: "customer" }),
  getMyAppointments: () => api.get("/doctors/appointments/me", { auth: "customer" }),
  getMyAppointment: (id) => api.get(`/doctors/appointments/${id}`, { auth: "customer" }),
  cancelAppointment: (id) => api.delete(`/doctors/appointments/${id}`, { auth: "customer" }),
  rescheduleAppointment: (id, data) => api.patch(`/doctors/appointments/${id}`, data, { auth: "customer" }),
  joinConsultation: (id) => api.post(`/doctors/appointments/${id}/join`, {}, { auth: "customer" }),
  getConsultation: (meetingId) => api.get(`/doctors/consultation/${meetingId}`),
  submitReview: (doctorId, data) => api.post(`/doctors/${doctorId}/reviews`, data, { auth: "customer" }),
};

export const telehealthApi = {
  getChat: (appointmentId, options = {}) =>
    api.get(`/telehealth/appointments/${appointmentId}/chat`, options),
  sendMessage: (appointmentId, data, options = {}) =>
    api.post(`/telehealth/appointments/${appointmentId}/chat/messages`, data, options),
  markRead: (appointmentId, options = {}) =>
    api.patch(`/telehealth/appointments/${appointmentId}/chat/read`, {}, options),
  getVideoAccess: (appointmentId, options = {}) =>
    api.get(`/telehealth/appointments/${appointmentId}/video`, options),
};

export const labTestsApi = {
  getCategories: () => api.get("/lab-tests/categories"),
  getTimeSlots: () => api.get("/lab-tests/time-slots"),
  getPopular: () => api.get("/lab-tests/popular"),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(query ? `/lab-tests?${query}` : "/lab-tests");
  },
  getById: (id) => api.get(`/lab-tests/${id}`),
  book: (data) => api.post("/lab-tests/bookings", data),
  getMyBookings: () => api.get("/lab-tests/bookings/me"),
};

export const adminGeneralApi = {
  getDoctors: () => api.get("/admin/doctors"),
  createDoctor: (data) => api.post("/admin/doctors", data),
  updateDoctorStatus: (id, is_active, note) => api.patch(`/admin/doctors/${id}/status`, { is_active, note }),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getDoctorAppointments: (id) => api.get(`/admin/doctors/${id}/appointments`),
  
  getLabs: () => api.get("/admin/labs"),
  createLab: (data) => api.post("/admin/labs", data),
  updateLabStatus: (id, status, note) => api.patch(`/admin/labs/${id}/status`, { status, note }),
  deleteLab: (id) => api.delete(`/admin/labs/${id}`),
  
  createVendor: (data) => api.post("/admin/vendors", data),
  
  getAuditLogs: () => api.get("/admin/audit-logs"),
  
  impersonate: (entity_id, role) => api.post("/admin/impersonate", { entity_id, role })
};
