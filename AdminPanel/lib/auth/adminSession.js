"use client";

const AUTH_CHANNEL_NAME = "medzoos_admin_session_channel";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "medzoos_user";
const REMEMBER_KEY = "medzoos_admin_remember_email";

export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, offsetSeconds = 30) {
  if (!token || token === "cookie-auth-active") return false;
  const decoded = decodeJwtPayload(token);
  if (!decoded || !decoded.exp) return false;
  const expiryTimeMs = decoded.exp * 1000;
  const currentTimeMs = Date.now();
  return currentTimeMs + offsetSeconds * 1000 >= expiryTimeMs;
}

export function getAdminSession() {
  if (typeof window === "undefined") {
    return { token: null, refreshToken: null, user: null, isAuthenticated: false };
  }

  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const rawUser =
      localStorage.getItem(USER_KEY) ||
      localStorage.getItem("sehat1_user") ||
      localStorage.getItem("pharmahub_user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    const hasValidToken = Boolean(token && token !== "cookie-auth-active");
    const isAuthenticated = Boolean(hasValidToken && user && user.role === "admin");

    return { token, refreshToken, user, isAuthenticated };
  } catch {
    return { token: null, refreshToken: null, user: null, isAuthenticated: false };
  }
}

export function setAdminSession({ token, refreshToken, user, rememberMe, email }) {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    if (rememberMe && email) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else if (rememberMe === false) {
      localStorage.removeItem(REMEMBER_KEY);
    }

    broadcastSessionEvent("LOGIN", { user, timestamp: Date.now() });
    window.dispatchEvent(new Event("auth-updated"));
  } catch (err) {
    console.error("Failed to store admin session", err);
  }
}

export function getRememberedEmail() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REMEMBER_KEY) || "";
}

export function clearAdminSession(broadcast = true) {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("sehat1_user");
    localStorage.removeItem("pharmahub_user");

    if (broadcast) {
      broadcastSessionEvent("LOGOUT", { timestamp: Date.now() });
      window.dispatchEvent(new Event("auth-updated"));
    }
  } catch (err) {
    console.error("Failed to clear admin session", err);
  }
}

export function broadcastSessionEvent(type, payload = {}) {
  if (typeof window === "undefined") return;

  const eventData = { type, payload, timestamp: Date.now() };

  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage(eventData);
      channel.close();
    }
  } catch {
    // BroadcastChannel unsupported or blocked
  }

  try {
    localStorage.setItem("medzoos_session_sync", JSON.stringify(eventData));
    localStorage.removeItem("medzoos_session_sync");
  } catch {
    // Storage fallback
  }
}

export function subscribeToSessionEvents(callback) {
  if (typeof window === "undefined") return () => {};

  let channel;
  const handleBroadcastMessage = (event) => {
    if (event?.data) {
      callback(event.data);
    }
  };

  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.onmessage = handleBroadcastMessage;
    }
  } catch {
    // Channel initialization fallback
  }

  const handleStorage = (event) => {
    if (event.key === "medzoos_session_sync" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(parsed);
      } catch {}
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener("storage", handleStorage);
  };
}
