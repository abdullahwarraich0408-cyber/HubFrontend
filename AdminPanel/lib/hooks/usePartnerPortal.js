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

export function useCreateDoctorPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => doctorPortalApi.createPrescription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-portal-appointments"] });
    },
  });
}

export function useDoctorPrescription(appointmentId, options = {}) {
  return useQuery({
    queryKey: ["doctor-prescription", appointmentId],
    enabled: Boolean(appointmentId),
    queryFn: async () => {
      const data = await doctorPortalApi.getPrescription(appointmentId);
      return data.prescription;
    },
    ...options,
  });
}

export function useLabPortalProfile(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-profile"],
    queryFn: async () => {
      const data = await labPortalApi.getProfile();
      return mapLabProfileFromApi(data.lab);
    },
    ...options,
  });
}

export function useUpdateLabPortalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile) => labPortalApi.updateProfile(mapLabProfileToApi(profile)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-portal-profile"] }),
  });
}

export function useLabPortalBookings(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-bookings"],
    queryFn: async () => {
      const data = await labPortalApi.getBookings();
      return (data.bookings || []).map(mapLabBookingFromApi);
    },
    ...options,
  });
}

export function useUpdateLabBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => labPortalApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
    },
  });
}

export function useLabPortalTests(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-tests"],
    queryFn: async () => {
      const data = await labPortalApi.getTests();
      return (data.tests || []).map(mapLabTestFromApi);
    },
    ...options,
  });
}

export function useCreateLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (test) => labPortalApi.createTest(mapLabTestToApi(test)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] }),
  });
}

export function useUpdateLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...test }) => labPortalApi.updateTest(id, mapLabTestToApi(test)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] }),
  });
}

export function useDeleteLabPortalTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => labPortalApi.deleteTest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-portal-tests"] }),
  });
}

export function useLabPortalReports(options = {}) {
  return useQuery({
    queryKey: ["lab-portal-reports"],
    queryFn: async () => {
      const data = await labPortalApi.getReportsSummary();
      return data.summary;
    },
    ...options,
  });
}
