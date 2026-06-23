"use client";

const CART_KEY = "pharmahub_lab_cart";

export function getLabCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLabCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("lab-cart-updated"));
}

export function addToLabCart(test) {
  const cart = getLabCart();
  if (cart.some((item) => item.id === test.id)) return cart;
  const next = [...cart, test];
  saveLabCart(next);
  return next;
}

export function removeFromLabCart(testId) {
  const next = getLabCart().filter((item) => item.id !== testId);
  saveLabCart(next);
  return next;
}

export function clearLabCart() {
  saveLabCart([]);
}

export function groupCartByLab(cart = []) {
  const groups = new Map();
  for (const test of cart) {
    const labKey = test.labPartnerId || test.lab || "unknown";
    if (!groups.has(labKey)) {
      groups.set(labKey, { lab: test.lab, labPartnerId: test.labPartnerId, tests: [] });
    }
    groups.get(labKey).tests.push(test);
  }
  return [...groups.values()];
}
