import { getPartnerToken } from "../partnerAuth";
import { AUTH_SIGN_IN_EVENT } from "../authModalEvents";
import {
  clearAuthStorage,
  getDeviceId,
  getMemoryAccessToken,
  persistUser,
  setMemoryAccessToken,
} from "../auth/tokenStore";

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

function openExpiredSignInModal(pathname = "") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_SIGN_IN_EVENT, {
      detail: { redirect: pathname || "/", expired: true },
    })
  );
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
    return getMemoryAccessToken();
  }

  if (isPartnerPath(path, options)) {
    return getPartnerToken();
  }

  const currentPath = window.location.pathname;

  if (currentPath.startsWith("/consultation")) {
    const partnerToken = getPartnerToken();
    const partnerRole = localStorage.getItem("partnerRole");
    if (partnerToken && partnerRole === "doctor") return partnerToken;

    const customerToken = getMemoryAccessToken();
    if (customerToken) return customerToken;

    return partnerToken || null;
  }

  if (isPartnerPortalPath(currentPath)) {
    const partnerToken = getPartnerToken();
    if (partnerToken) return partnerToken;
  }

  return getMemoryAccessToken();
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

let customerRefreshPromise = null;

async function refreshCustomerSession() {
  if (customerRefreshPromise) {
    return customerRefreshPromise;
  }

  customerRefreshPromise = (async () => {
    const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        platform: "web",
      }),
    });

    const payload = await parseResponse(refreshResponse).catch(() => null);
    const data = payload?.data ?? payload ?? {};
    const tokens = data.tokens ?? data;
    const accessToken = tokens?.accessToken ?? data?.accessToken ?? data?.token ?? null;

    if (!refreshResponse.ok || !accessToken) {
      throw new ApiError(
        payload?.message || "Your session has expired. Please log in again.",
        refreshResponse.status,
        payload
      );
    }

    setMemoryAccessToken(accessToken);
    if (data.user) {
      persistUser(data.user);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }

    return accessToken;
  })().finally(() => {
    customerRefreshPromise = null;
  });

  return customerRefreshPromise;
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

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, config);
  } catch (err) {
    throw new ApiError(
      err?.message === "Failed to fetch"
        ? "Unable to reach the server. Check that the backend is running."
        : err?.message || "Network request failed",
      0,
      null
    );
  }
  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined" && path !== "/auth/refresh") {
      const pathname = window.location.pathname;
      const isPartnerRequest =
        auth === "partner" || (auth !== "customer" && isPartnerPortalPath(pathname));

      if (isPartnerRequest) {
        const refreshToken = localStorage.getItem("partnerRefreshToken");
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            if (refreshRes.ok) {
              const data = await refreshRes.json();
              const newAuth = data.data || data;
              const partnerToken =
                newAuth?.token ?? newAuth?.accessToken ?? newAuth?.tokens?.accessToken ?? null;
              if (partnerToken) {
                localStorage.setItem("partnerToken", partnerToken);
                if (newAuth.refreshToken) localStorage.setItem("partnerRefreshToken", newAuth.refreshToken);
                if (newAuth.tokens?.refreshToken) {
                  localStorage.setItem("partnerRefreshToken", newAuth.tokens.refreshToken);
                }
                config.headers.Authorization = `Bearer ${partnerToken}`;
                const retryResponse = await fetch(`${API_BASE}${path}`, config);
                const retryPayload = await parseResponse(retryResponse).catch(() => null);
                if (retryResponse.ok) {
                  if (retryResponse.status === 204) return null;
                  return retryPayload?.data ?? retryPayload;
                }
              }
            }
          } catch {
            // Fall through to partner sign-out
          }
        }

        if (localStorage.getItem("partnerToken")) {
          localStorage.removeItem("partnerToken");
          localStorage.removeItem("partnerRefreshToken");
          localStorage.removeItem("partnerRole");
          localStorage.removeItem("partnerData");
        }
      } else {
        try {
          const nextAccessToken = await refreshCustomerSession();
          config.headers.Authorization = `Bearer ${nextAccessToken}`;
          const retryResponse = await fetch(`${API_BASE}${path}`, config);
          const retryPayload = await parseResponse(retryResponse).catch(() => null);
          if (retryResponse.ok) {
            if (retryResponse.status === 204) return null;
            return retryPayload?.data ?? retryPayload;
          }
        } catch {
          clearAuthStorage();
          window.dispatchEvent(new Event("auth-updated"));
        }
      }

      if (!isPartnerRequest) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login") && !currentPath.includes("/sign-in")) {
          openExpiredSignInModal(currentPath);
        }
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
