"use client";

import { useMemo } from "react";
import {
  useDoctors,
  useDoctorAppointments,
  useOrders,
  useLabTestBookings,
} from "@/lib/hooks/useApi";
import { HomeHeroCarousel } from "../components/patient/HomeHeroCarousel";
import { HealthcareGateway } from "../components/patient/HealthcareGateway";
import { DiabetesEditorial } from "../components/patient/DiabetesEditorial";
import { DoctorsDiscovery } from "../components/patient/DoctorsDiscovery";
import { LabSearchSection } from "../components/patient/LabSearchSection";
import { PharmacyMarketplace } from "../components/patient/PharmacyMarketplace";
import { HealthcareActivityRow } from "../components/patient/HealthcareActivityRow";
import { SpecialtyStrip } from "../components/patient/SpecialtyStrip";
import { CampaignBanners } from "../components/patient/CampaignBanners";
import { ClosingBand } from "../components/patient/ClosingBand";
import { LoggedInFooter } from "../components/patient/LoggedInFooter";

export function HomePage() {
  const doctorsQuery = useDoctors();
  const appointmentsQuery = useDoctorAppointments();
  const ordersQuery = useOrders();
  const labBookingsQuery = useLabTestBookings();

  const featuredDoctors = useMemo(() => {
    return doctorsQuery.data || [];
  }, [doctorsQuery.data]);

  return (
    <div className="w-full bg-white">
      <div className="home-container mx-auto pt-6 md:pt-7 lg:pt-8">
        <HomeHeroCarousel />
      </div>

      <div className="mt-10 md:mt-12 lg:mt-14">
        <HealthcareGateway />
        <DiabetesEditorial />
        <DoctorsDiscovery
          doctors={featuredDoctors}
          isLoading={doctorsQuery.isLoading}
          isError={doctorsQuery.isError}
          onRetry={() => doctorsQuery.refetch()}
        />
        <LabSearchSection />
        <PharmacyMarketplace />
        <HealthcareActivityRow
          appointments={appointmentsQuery.data || []}
          orders={ordersQuery.data || []}
          labBookings={labBookingsQuery.data || []}
          isLoading={
            appointmentsQuery.isLoading ||
            ordersQuery.isLoading ||
            labBookingsQuery.isLoading
          }
        />
        <SpecialtyStrip />
        <CampaignBanners />
        <ClosingBand />
      </div>
    </div>
  );
}
