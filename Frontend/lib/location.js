function getGeolocationErrorMessage(error) {
  if (!error) return "Could not detect location";

  if (error.code === 1) {
    return "Location access was blocked. Enter your address manually or allow location in your browser settings.";
  }
  if (error.code === 2) {
    return "Your location is unavailable right now. Enter your address manually.";
  }
  if (error.code === 3) {
    return "Location detection timed out. Enter your address manually and try again.";
  }

  return error.message || "Could not detect location";
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(new Error(getGeolocationErrorMessage(error)));
    }, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000,
    });
  });
}

export async function reverseGeocode(latitude, longitude) {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  if (!response.ok) {
    throw new Error("Could not detect your location");
  }

  return response.json();
}

export async function detectDeliveryAddress() {
  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;
  const data = await reverseGeocode(latitude, longitude);

  const city = data.city || data.locality || "";
  const province = data.principalSubdivision || "";
  const street =
    data.street ||
    data.localityInfo?.informative?.find((item) => item.description?.includes("road"))?.name ||
    data.locality ||
    city;

  return {
    street,
    city,
    province,
    latitude,
    longitude,
    zone: city,
    label: [street, city, province].filter(Boolean).join(", "),
  };
}

export const SUPPORTED_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Gujranwala",
];
