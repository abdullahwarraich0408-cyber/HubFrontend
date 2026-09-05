"use client";

import { io } from "socket.io-client";
import { getPartnerToken } from "./partnerAuth";
import { getMemoryAccessToken } from "./auth/tokenStore";

let socket = null;
let activeToken = null;

export function getSocketUrl() {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  if (apiUrl.startsWith("http")) {
    const url = new URL(apiUrl);
    if (url.pathname.endsWith("/api")) {
      url.pathname = url.pathname.replace(/\/api\/?$/, "") || "/";
    }
    return url.origin + (url.pathname === "/" ? "" : url.pathname);
  }

  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
}

export function resolveSocketToken(authMode) {
  if (typeof window === "undefined") return null;

  if (authMode === "partner" || authMode === "doctor") {
    return getPartnerToken();
  }

  if (authMode === "customer") {
    return getMemoryAccessToken();
  }

  const partnerToken = getPartnerToken();
  if (partnerToken) return partnerToken;

  return getMemoryAccessToken();
}

export function getSocket(authMode) {
  const token = resolveSocketToken(authMode);
  if (!token) return null;

  if (socket && activeToken === token) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  activeToken = token;
  socket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", () => {
    // Keep quiet in UI; polling still updates the inbox.
  });

  return socket;
}
