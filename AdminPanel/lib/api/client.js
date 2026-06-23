import { getPartnerToken } from "../partnerAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const PARTNER_PATH_PREFIXES = [
  "/partners/",
  "/vendors/profile",
  "/vendors/products/mine",
  "/vendors/dashboard/stats",
  "/orders/vendor",
  "/vendor/",
];

function isPartnerPortalPath(pathname = "") {
  if (pathname.startsWith("/hub/")) return true;
  if (pathname === "/vendor" || pathname.startsWith("/vendor/")) return true;
  if (pathname === "/doctor" || pathname.startsWith("/doctor/")) return true;
  if (pathname === "/lab-test" || pathname.startsWith("/lab-test/")) return true;
  return false;
}

function getExpiredRedirectPath(pathname = "") {
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal-access")) {
    return "/portal-access?expired=true";
  }
  return "/portal-access?expired=true";
}

function isPartnerPath(path, options = {}) {
  if (PARTNER_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return true;
  }

  const method = (options.method || "GET").toUpperCase();
  if (path.startsWith("/products") && method !== "GET") {
    return true;
  }
  if (path.startsWith("/orders/") && method !== "GET") {
    return true;
  }

  return false;
}

function resolveAuthToken(path, options) {
  if (typeof window === "undefined") return null;

  if (options.auth === "partner") {
    return getPartnerToken();
  }

  if (options.auth === "customer") {
    const token = localStorage.getItem("token");
    return token && token !== "cookie-auth-active" ? token : null;
  }

  if (isPartnerPath(path, options)) {
    return getPartnerToken();
  }

  const currentPath = window.location.pathname;

  if (currentPath.startsWith("/consultation")) {
    const partnerToken = getPartnerToken();
    const partnerRole = localStorage.getItem("partnerRole");
    if (partnerToken && partnerRole === "doctor") return partnerToken;

    const customerToken = localStorage.getItem("token");
    if (customerToken && customerToken !== "cookie-auth-active") return customerToken;

    return partnerToken || null;
  }

  if (isPartnerPortalPath(currentPath)) {
    const partnerToken = getPartnerToken();
    if (partnerToken) return partnerToken;
  }

  const token = localStorage.getItem("token");
  return token && token !== "cookie-auth-active" ? token : null;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return null;
}

export async function apiClient(path, options = {}) {
  const { method = "GET", body, headers = {}, auth, ...rest } = options;
  const token = resolveAuthToken(path, { auth, method });

  const config = {
    method,
    credentials: "include",
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isPartner = isPartnerPortalPath(pathname);
      const refreshToken = isPartner ? localStorage.getItem('partnerRefreshToken') : localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAuth = data.data || data;
            if (isPartner) {
              localStorage.setItem('partnerToken', newAuth.token);
              if (newAuth.refreshToken) localStorage.setItem('partnerRefreshToken', newAuth.refreshToken);
            } else {
              localStorage.setItem('token', newAuth.token);
              if (newAuth.refreshToken) localStorage.setItem('refreshToken', newAuth.refreshToken);
            }
            config.headers.Authorization = `Bearer ${newAuth.token}`;
            const retryResponse = await fetch(`${API_BASE}${path}`, config);
            const retryPayload = await parseResponse(retryResponse).catch(() => null);
            if (retryResponse.ok) {
              if (retryResponse.status === 204) return null;
              return retryPayload?.data ?? retryPayload;
            }
          }
        } catch (e) {
          // Fall through to clear tokens if refresh fails
        }
      }

      const hadPartnerSession = Boolean(localStorage.getItem('partnerToken'));
      const hadCustomerSession = Boolean(localStorage.getItem('token'));

      if (hadCustomerSession) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      if (hadPartnerSession && isPartner) {
        localStorage.removeItem('partnerToken');
        localStorage.removeItem('partnerRefreshToken');
        localStorage.removeItem('partnerRole');
        localStorage.removeItem('partnerData');
      }

      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.includes("/sign-in")) {
        window.location.href = getExpiredRedirectPath(currentPath);
      }
    }
    let message =
      payload?.message ||
      payload?.error?.message ||
      `Request failed with status ${response.status}`;
    
    if (message.toLowerCase().includes("jwt expired")) {
      message = "Your session has expired. Please log in again.";
    }
    
    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) {
    return null;
  }

  return payload?.data ?? payload;
}

export const api = {
  get: (path, options) => apiClient(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiClient(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiClient(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiClient(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiClient(path, { ...options, method: "DELETE" }),
};
