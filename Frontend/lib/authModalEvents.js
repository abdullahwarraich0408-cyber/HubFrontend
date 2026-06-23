export const AUTH_SIGN_IN_EVENT = "pharmahub:open-sign-in";

export function openSignInModal({ redirect = "/", expired = false } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_SIGN_IN_EVENT, {
      detail: { redirect, expired },
    })
  );
}
