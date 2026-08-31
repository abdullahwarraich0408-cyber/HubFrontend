export function getPortalUrls() {
  const isBrowser = typeof window !== "undefined";
  const hostname = isBrowser ? window.location.hostname : "";
  const isProduction = hostname.includes("medzoos.com");

  const envDoctor = process.env.NEXT_PUBLIC_DOCTOR_PANEL_URL;
  const envVendor = process.env.NEXT_PUBLIC_VENDOR_PANEL_URL;
  const envLab = process.env.NEXT_PUBLIC_LAB_PANEL_URL;
  const envCustomer =
    process.env.NEXT_PUBLIC_CUSTOMER_PANEL_URL || process.env.NEXT_PUBLIC_FRONTEND_URL;
  const envAdmin = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL;

  if (isProduction) {
    return {
      doctor: envDoctor || "https://doctor.medzoos.com",
      vendor: envVendor || "https://vendor.medzoos.com",
      lab: envLab || "https://lab.medzoos.com",
      customer: envCustomer || "https://medzoos.com",
      admin: envAdmin || "https://admin.medzoos.com",
    };
  }

  return {
    doctor: envDoctor || "http://localhost:3003",
    vendor: envVendor || "http://localhost:3002",
    lab: envLab || "http://localhost:3004",
    customer: envCustomer || "http://localhost:3000",
    admin: envAdmin || "http://localhost:3005",
  };
}

export const partnerRoutes = {
  vendor: {
    login: "/vendor",
    dashboard: "/vendor/dashboard",
    products: "/vendor/products",
    orders: "/vendor/orders",
    reports: "/vendor/reports",
    settings: "/vendor/settings",
  },
  doctor: {
    login: "/doctor",
    dashboard: "/doctor/dashboard",
    appointments: "/doctor/appointments",
    schedule: "/doctor/schedule",
    patients: "/doctor/patients",
    settings: "/doctor/settings",
  },
  lab: {
    login: "/lab",
    dashboard: "/lab/dashboard",
    bookings: "/lab/bookings",
    tests: "/lab/tests",
    reports: "/lab/reports",
    settings: "/lab/settings",
  },
};

