import { useMemo } from "react";
import {
  useUserProfile,
  useAllOrders,
  usePrescriptionOrders,
  usePrescriptions,
  useLabReports,
  useFamilyVault,
  useFamilyDashboard,
} from "@/lib/hooks/useApi";
import { mergeProfileData } from "./profileData";

export function useDynamicProfile({ enabled = true } = {}) {
  const { data: profile, isLoading: profileLoading } = useUserProfile({ enabled });
  const { data: vault, isLoading: vaultLoading } = useFamilyVault({ enabled });
  const { data: dashboard, isLoading: dashboardLoading } = useFamilyDashboard({
    enabled: enabled && Boolean(vault),
  });
  const { data: labReports = [], isLoading: labLoading } = useLabReports({ enabled });
  const { data: allOrders = [] } = useAllOrders({ enabled });
  const { data: prescriptionOrders = [] } = usePrescriptionOrders({ enabled });
  const { data: uploadedPrescriptions = [] } = usePrescriptions({ enabled });

  const profileData = useMemo(
    () => mergeProfileData(profile?.profile_data),
    [profile?.profile_data]
  );

  const familyMembers = useMemo(() => {
    const source = dashboard?.members || vault?.members || [];
    return source.map((m) => ({
      id: m.id,
      name: m.full_name,
      relation: m.relationship,
      bloodGroup: m.blood_group || "",
      healthScore: m.health_score,
      statusLines: m.status_lines || [],
    }));
  }, [dashboard?.members, vault?.members]);

  const medicalRecords = useMemo(() => {
    const fromLabs = labReports.map((report) => ({
      id: `lab-${report.id}`,
      type: "Lab Report",
      title: report.testName || "Lab test",
      date: report.collectionDate
        ? new Date(report.collectionDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      lab: report.lab || "Lab partner",
      fileUrl: report.reportUrl,
      source: "lab",
    }));

    const manual = (profileData.medicalRecords || []).map((record) => ({
      ...record,
      source: "manual",
    }));

    return [...fromLabs, ...manual];
  }, [labReports, profileData.medicalRecords]);

  const dashboardStats = useMemo(() => {
    const activeOrders = allOrders.filter(
      (o) => !["delivered", "cancelled"].includes(o.status)
    ).length;
    const upcomingAppts = allOrders.filter(
      (o) =>
        o.type === "doctor" &&
        !["completed", "cancelled", "delivered"].includes(o.rawStatus || o.status)
    ).length;
    const activeRx = prescriptionOrders.filter(
      (o) => !["delivered", "cancelled", "no_vendor"].includes(o.status)
    ).length;

    return [
      { label: "Active Orders", value: String(activeOrders), href: "/orders" },
      { label: "Upcoming Appointments", value: String(upcomingAppts), href: "/account/appointments" },
      { label: "Lab Reports", value: String(labReports.length), href: "/account/reports" },
      {
        label: "Family Members",
        value: String(familyMembers.length),
        href: familyMembers.length ? "/family-health" : null,
        section: familyMembers.length ? null : "family",
      },
    ];
  }, [allOrders, prescriptionOrders, labReports.length, familyMembers.length]);

  const familyAlerts = useMemo(() => {
    if (!dashboard?.members?.length) return [];
    return dashboard.members.flatMap((m) =>
      (m.status_lines || [])
        .filter((line) => line && line !== "No urgent items")
        .slice(0, 1)
        .map((line) => ({ member: m.full_name, message: line }))
    );
  }, [dashboard?.members]);

  const isLoading =
    profileLoading || (enabled && vaultLoading) || (enabled && vault && dashboardLoading) || labLoading;

  return {
    profile,
    profileData,
    vault,
    dashboard,
    familyMembers,
    medicalRecords,
    dashboardStats,
    familyAlerts,
    familyHealthScore: dashboard?.overall_score ?? vault?.family_health_score ?? null,
    labReports,
    allOrders,
    prescriptionOrders,
    uploadedPrescriptions,
    isLoading,
    hasVault: Boolean(vault),
  };
}
