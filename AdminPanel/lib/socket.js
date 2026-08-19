"use client";

import { io } from "socket.io-client";

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

  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
}

export function getAdminSocket() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (socket && activeToken === token) {
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
  });

  return socket;
}
