import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorPortalApi, labPortalApi } from "@/lib/api/index";
import {
  mapDoctorProfileFromApi,
  mapDoctorProfileToApi,
  mapDoctorAppointmentFromApi,
  mapDoctorPatientFromApi,
  mapLabProfileFromApi,
  mapLabProfileToApi,
  mapLabBookingFromApi,
  mapLabTestFromApi,
  mapLabTestToApi,
} from "@/lib/mappers/partnerPortal";
import { labLocalStoreApi } from "@/lib/store/labStore";
import { toBackendStatus } from "@/lib/constants/lab";
import { useInboxNotifications, formatNotificationTime } from "@/lib/hooks/useInboxNotifications";
import { getSocket } from "@/lib/socket";

// --- React Query Keys ---
export const partnerPortalKeys = {
  lab: {
    all: ["lab-portal"],
    profile: () => ["lab-portal-profile"],
    bookings: () => ["lab-portal-bookings"],
    bookingById: (id) => ["lab-portal-booking", id],
    tests: () => ["lab-portal-tests"],
    collectors: () => ["lab-portal-collectors"],
    reports: () => ["lab-portal-reports"],
  },
};

// --- Live Store Subscription Hook ---
export function useLabStoreSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-collectors"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-profile"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-booking"] });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("medzoos-lab-store-updated", handleUpdate);
      return () => {
        window.removeEventListener("medzoos-lab-store-updated", handleUpdate);
      };
    }
  }, [queryClient]);
}

// --- Notifications Hook ---
export function useLabNotifications() {
  const inbox = useInboxNotifications({
    getSocket: () => getSocket("partner"),
  });

  return {
    notifications: inbox.notifications.map((item) => ({
      ...item,
      time: formatNotificationTime(item.createdAt),
    })),
    unreadCount: inbox.unreadCount,
    markAllAsRead: inbox.markAllRead,
    markAsRead: inbox.markRead,
    clearAll: inbox.markAllRead,
  };
}

// --- Doctor Portal Legacy Hooks (preserved) ---
export function useDoctorPortalProfile(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-profile"],
    queryFn: async () => {
      const data = await doctorPortalApi.getProfile();
      return mapDoctorProfileFromApi(data.doctor);
    },
    ...options,
  });
}

export function useUpdateDoctorPortalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile) => doctorPortalApi.updateProfile(mapDoctorProfileToApi(profile)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-portal-profile"] }),
  });
}

export function useDoctorPortalAppointments(options = {}) {
  const { data: profile } = useDoctorPortalProfile({ staleTime: 60000 });
  return useQuery({
    queryKey: ["doctor-portal-appointments"],
    queryFn: async () => {
      const data = await doctorPortalApi.getAppointments();
      return (data.appointments || []).map((apt) =>
        mapDoctorAppointmentFromApi(apt, profile?.online ?? true)
      );
    },
    enabled: options.enabled !== false,
    ...options,
  });
}

export function useUpdateDoctorAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }) => doctorPortalApi.updateAppointmentStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-portal-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-portal-stats"] });
    },
  });
}

export function useDoctorPortalPatients(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-patients"],
    queryFn: async () => {
      const data = await doctorPortalApi.getPatients();
      return (data.patients || []).map(mapDoctorPatientFromApi);
    },
    ...options,
  });
}

export function useDoctorPortalStats(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-stats"],
    queryFn: async () => {
      const data = await doctorPortalApi.getStats();
      return data.stats || data.summary || data;
    },
    ...options,
  });
}

export function useDoctorPortalSchedule(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-schedule"],
    queryFn: async () => {
      const data = await doctorPortalApi.getSchedule();
      return data.schedule || [];
    },
    ...options,
  });
}

export function useUpdateDoctorSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slots) => doctorPortalApi.updateSchedule(slots),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-portal-profile"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-portal-schedule"] });
    },
  });
}

export function useDoctorPortalHospitals(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-hospitals"],
    queryFn: async () => {
      const data = await doctorPortalApi.getHospitals();
      return data.hospitals || [];
    },
    ...options,
  });
}

export function useDoctorPortalPracticeLocations(options = {}) {
  return useQuery({
    queryKey: ["doctor-portal-practice-locations"],
    queryFn: async () => {
      const data = await doctorPortalApi.getPracticeLocations();
      return data.locations || [];
    },
    ...options,
  });
}

export function useAddDoctorPracticeLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => doctorPortalApi.addPracticeLocation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-portal-practice-locations"] }),
  });
}

export function useDeleteDoctorPracticeLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => doctorPortalApi.deletePracticeLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-portal-practice-locations"] }),
  });
}

// --- Lab Portal Dynamic Hooks ---

export function useLabPortalProfile(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-profile"],
    queryFn: async () => {
      try {
        const data = await labPortalApi.getProfile();
        if (data?.partner || data?.profile) {
          return mapLabProfileFromApi(data.partner || data.profile);
        }
      } catch {
        // Fallback to local store
      }
      return labLocalStoreApi.getProfile();
    },
    ...options,
  });
}

export function useUpdateLabPortalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile) => {
      const localUpdated = labLocalStoreApi.updateProfile(profile);
      try {
        await labPortalApi.updateProfile(mapLabProfileToApi(profile));
      } catch (err) {
        console.warn("Backend updateProfile unavailable, saved locally", err);
      }
      return localUpdated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-profile"] });
    },
  });
}

export function useLabPortalBookings(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-bookings"],
    queryFn: async () => {
      try {
        const data = await labPortalApi.getBookings();
        if (Array.isArray(data?.bookings) && data.bookings.length > 0) {
          return data.bookings.map(mapLabBookingFromApi);
        }
      } catch {
        // Fallback to local store
      }
      const localBookings = labLocalStoreApi.getBookings();
      return (localBookings || []).map(mapLabBookingFromApi);
    },
    ...options,
  });
}

export function useLabBookingById(id, options = {}) {
  return useQuery({
    queryKey: ["lab-portal-booking", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const data = await labPortalApi.getBookingById(id);
        if (data?.booking) return mapLabBookingFromApi(data.booking);
      } catch {
        // Fallback to local store
      }
      const local = labLocalStoreApi.getBookingById(id);
      return local ? mapLabBookingFromApi(local) : null;
    },
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateLabBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingData) => {
      return labLocalStoreApi.createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
    },
  });
}

export function useSimulateIncomingOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return labLocalStoreApi.simulateIncomingOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
    },
  });
}

export function useUpdateLabBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }) => {
      const backendStatus = toBackendStatus(status);
      const localUpdated = labLocalStoreApi.updateBookingStatus(id, status, note);
      try {
        await labPortalApi.updateBookingStatus(id, backendStatus, note);
      } catch (err) {
        console.warn("Backend updateBookingStatus unavailable, saved locally", err);
      }
      return localUpdated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-booking"] });
    },
  });
}

export function useAssignLabCollector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, collector_id, collector_name, collector_phone, note }) => {
      const localUpdated = labLocalStoreApi.assignCollector(bookingId, {
        collector_id,
        collector_name,
        collector_phone,
        note,
      });
      try {
        await labPortalApi.assignCollector(bookingId, {
          collector_id,
          collector_name,
          collector_phone,
          note,
        });
      } catch (err) {
        console.warn("Backend assignCollector unavailable, updated locally", err);
      }
      return localUpdated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-booking"] });
    },
  });
}

export function useUploadLabReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, file, report_url, notes }) => {
      let fileName = file?.name || "Diagnostic_Report.pdf";
      let resolvedUrl = report_url || "https://medzoos.com/reports/" + fileName;

      if (file) {
        try {
          const res = await labPortalApi.uploadReportFile(bookingId, file);
          if (res?.url) resolvedUrl = res.url;
        } catch (err) {
          console.warn("File upload to server failed, storing simulated report url", err);
          resolvedUrl = URL.createObjectURL(file);
        }
      } else if (report_url) {
        try {
          await labPortalApi.uploadReport(bookingId, report_url);
        } catch (err) {
          console.warn("Report URL sync failed, updating locally", err);
        }
      }

      return labLocalStoreApi.uploadReport(bookingId, {
        report_url: resolvedUrl,
        report_file_name: fileName,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-booking"] });
    },
  });
}

export function useLabPortalTests(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-tests"],
    queryFn: async () => {
      try {
        const data = await labPortalApi.getTests();
        if (Array.isArray(data?.tests) && data.tests.length > 0) {
          return data.tests.map(mapLabTestFromApi);
        }
      } catch {
        // Fallback to local store
      }
      const localTests = labLocalStoreApi.getTests();
      return (localTests || []).map(mapLabTestFromApi);
    },
    ...options,
  });
}

export function useCreateLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (test) => {
      const localTest = labLocalStoreApi.createTest(test);
      try {
        await labPortalApi.createTest(mapLabTestToApi(test));
      } catch (err) {
        console.warn("Backend createTest unavailable, saved locally", err);
      }
      return localTest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] });
    },
  });
}

export function useUpdateLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...test }) => {
      const localUpdated = labLocalStoreApi.updateTest(id, test);
      try {
        await labPortalApi.updateTest(id, mapLabTestToApi(test));
      } catch (err) {
        console.warn("Backend updateTest unavailable, saved locally", err);
      }
      return localUpdated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] });
    },
  });
}

export function useDeleteLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const deleted = labLocalStoreApi.deleteTest(id);
      try {
        await labPortalApi.deleteTest(id);
      } catch (err) {
        console.warn("Backend deleteTest unavailable, removed locally", err);
      }
      return deleted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] });
    },
  });
}

export function useLabPortalCollectors(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-collectors"],
    queryFn: async () => {
      return labLocalStoreApi.getCollectors();
    },
    ...options,
  });
}

export function useCreateLabCollector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (collector) => {
      return labLocalStoreApi.createCollector(collector);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-collectors"] });
    },
  });
}

export function useUpdateLabCollector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      return labLocalStoreApi.updateCollector(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-collectors"] });
    },
  });
}

export function useDeleteLabCollector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return labLocalStoreApi.deleteCollector(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-collectors"] });
    },
  });
}

export function useLabPortalReports(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-reports"],
    queryFn: async () => {
      try {
        const data = await labPortalApi.getReportsSummary();
        if (data?.summary) return data.summary;
      } catch {
        // Fallback to local store calculations
      }
      return labLocalStoreApi.getReportsSummary();
    },
    ...options,
  });
}
