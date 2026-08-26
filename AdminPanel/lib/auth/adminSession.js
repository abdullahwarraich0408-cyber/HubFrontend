"use client";

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("medzoos_user");
  localStorage.removeItem("sehat1_user");
  localStorage.removeItem("pharmahub_user");
}
