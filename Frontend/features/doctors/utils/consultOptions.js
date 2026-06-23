function formatAvailabilityDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Available today";
  if (diffDays === 1) return "Available tomorrow";
  return `Available ${target.toLocaleDateString("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}`;
}

export function getDoctorAvailabilityLabel(doctor) {
  if (doctor.availableToday) return "Available today";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatAvailabilityDate(tomorrow);
}

export function mapPracticeLocationOption(location, doctor) {
  const hospital = location.hospital || location.hospitalData;
  const title = location.title || hospital?.name || location.clinic_name || "Clinic";
  const address =
    location.address ||
    (hospital?.address
      ? `${hospital.address}${hospital.city ? `, ${hospital.city}` : ""}`
      : hospital?.city || null);

  return {
    id: `in_person_${location.id}`,
    type: "in_person",
    practiceLocationId: location.id,
    hospitalId: location.hospital_id || hospital?.id || null,
    title,
    subtitle: address,
    location: address,
    fee: location.fee ?? doctor.fee,
    availability: location.availability || getDoctorAvailabilityLabel(doctor),
    days: location.days || [],
    nextAvailableDate: location.next_available_date || null,
  };
}

export function buildDoctorConsultOptions(doctor, { hospitalContext = null } = {}) {
  if (!doctor) return [];

  const options = [];
  const practiceLocations = doctor.practiceLocations || [];

  if (doctor.online) {
    options.push({
      id: "online",
      type: "online",
      practiceLocationId: null,
      hospitalId: null,
      title: "Online Video Consultation",
      subtitle: "Video call, chat & file uploads",
      location: null,
      fee: doctor.fee,
      availability: getDoctorAvailabilityLabel(doctor),
      days: [],
    });
  }

  const inPersonLocations = practiceLocations.length
    ? practiceLocations
    : doctor.hospitalId || doctor.hospital
      ? [
          {
            id: "legacy",
            hospital_id: doctor.hospitalId,
            title: doctor.hospitalData?.name || doctor.hospital,
            address: doctor.hospitalData?.address,
            fee: doctor.fee,
            availability: getDoctorAvailabilityLabel(doctor),
            days: [],
            hospital: doctor.hospitalData,
          },
        ]
      : [];

  inPersonLocations.forEach((location) => {
    const option = mapPracticeLocationOption(location, doctor);
    if (!hospitalContext || option.hospitalId === hospitalContext) {
      options.push(option);
    }
  });

  return options;
}

export function filterConsultOptions(options, consultType) {
  if (!consultType) return options;
  return options.filter((option) => option.type === consultType);
}
