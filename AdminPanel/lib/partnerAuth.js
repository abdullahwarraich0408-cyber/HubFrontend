const PARTNER_TOKEN_KEY = "partnerToken";
const PARTNER_REFRESH_KEY = "partnerRefreshToken";
const PARTNER_ROLE_KEY = "partnerRole";
const PARTNER_DATA_KEY = "partnerData";

export function getPartnerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PARTNER_TOKEN_KEY);
}

export function getPartnerRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PARTNER_ROLE_KEY);
}

export function getPartnerData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PARTNER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPartnerSession({ tokens, role, partner }) {
  if (typeof window === "undefined") return;
  if (tokens?.accessToken) {
    localStorage.setItem(PARTNER_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens?.refreshToken) {
    localStorage.setItem(PARTNER_REFRESH_KEY, tokens.refreshToken);
  }
  if (role) {
    localStorage.setItem(PARTNER_ROLE_KEY, role);
  }
  if (partner) {
    localStorage.setItem(PARTNER_DATA_KEY, JSON.stringify(partner));
  }
}

export function clearPartnerSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PARTNER_TOKEN_KEY);
  localStorage.removeItem(PARTNER_REFRESH_KEY);
  localStorage.removeItem(PARTNER_ROLE_KEY);
  localStorage.removeItem(PARTNER_DATA_KEY);
}

export function isPartnerAuthenticated(expectedRole) {
  const token = getPartnerToken();
  const role = getPartnerRole();
  if (!token || !role) return false;
  if (expectedRole && role !== expectedRole) return false;
  return true;
}

export function getPartnerSession() {
  return {
    token: getPartnerToken(),
    role: getPartnerRole(),
    partner: getPartnerData(),
  };
}
