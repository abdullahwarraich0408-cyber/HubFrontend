const DEFAULT_HOSPITAL_LOGO =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200";
const DEFAULT_HOSPITAL_COVER =
  "https://images.unsplash.com/photo-1586773860418-d47a0db32928?auto=format&fit=crop&q=80&w=1200";

export function mapHospitalToFrontend(hospital) {
  if (!hospital) return null;

  return {
    id: hospital.id,
    name: hospital.name,
    slug: hospital.slug,
    logo: hospital.logo || DEFAULT_HOSPITAL_LOGO,
    coverImage: hospital.cover_image || DEFAULT_HOSPITAL_COVER,
    description: hospital.description || "",
    address: hospital.address || "",
    city: hospital.city || "",
    phone: hospital.phone || "",
    email: hospital.email || "",
    isActive: hospital.is_active ?? true,
    doctorCount: hospital._count?.doctors ?? hospital.doctorCount ?? 0,
    createdAt: hospital.created_at,
  };
}

export function mapHospitalsToFrontend(hospitals = []) {
  return hospitals.map(mapHospitalToFrontend).filter(Boolean);
}
