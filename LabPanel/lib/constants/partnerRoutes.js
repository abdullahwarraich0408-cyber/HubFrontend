const labRoutes = {
  login: "/lab",
  dashboard: "/lab/dashboard",
  bookings: "/lab/bookings",
  tests: "/lab/tests",
  reports: "/lab/reports",
  settings: "/lab/settings",
};

export const partnerRoutes = {
  lab: labRoutes,
  // Legacy alias — LabPanel was copied from DoctorPanel; prevents crashes in leftover files
  doctor: labRoutes,
};
