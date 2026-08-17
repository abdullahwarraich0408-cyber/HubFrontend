import { cartApi } from "@/lib/api/index";

export async function mergeGuestCart() {
  try {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    if (guestCart.length > 0) {
      await cartApi.merge(guestCart);
      localStorage.removeItem("guest_cart");
    }
  } catch {
    // Cart merge is best-effort and must not block sign-in.
  }
}

export async function completeWebLogin({ router, redirectTo = "/" }) {
  await mergeGuestCart();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-updated"));
  }

  const destination = redirectTo?.startsWith("/") ? redirectTo : "/";
  router.push(destination);
  router.refresh();
}
