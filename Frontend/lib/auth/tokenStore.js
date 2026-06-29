/** In-memory access token — refresh token lives in HttpOnly cookie set by backend. */

let memoryAccessToken = null;

const USER_KEY = "pharmahub_user";

export function getMemoryAccessToken() {
  return memoryAccessToken;
}

export function setMemoryAccessToken(token) {
  memoryAccessToken = token;
}

export function clearMemoryAccessToken() {
  memoryAccessToken = null;
}

export function loadStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthStorage() {
  clearMemoryAccessToken();
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

export function hasAuthSession() {
  if (typeof window === "undefined") return false;
  const user = loadStoredUser();
  return Boolean(user || memoryAccessToken);
}

export function getDeviceId() {
  if (typeof window === "undefined") return "web-anonymous";
  let deviceId = localStorage.getItem("pharmahub_device_id");
  if (!deviceId) {
    deviceId = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("pharmahub_device_id", deviceId);
  }
  return deviceId;
}

let pendingAuthAction = null;

export function setPendingAuthAction(action) {
  pendingAuthAction = action;
}

export function consumePendingAuthAction() {
  const action = pendingAuthAction;
  pendingAuthAction = null;
  return action;
}

export function getPendingAuthAction() {
  return pendingAuthAction;
}
