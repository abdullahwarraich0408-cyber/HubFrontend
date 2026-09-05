"use client";

const CART_KEY = "medzoos_lab_cart";

export function getLabCart() {
  return [];
}

export function saveLabCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new CustomEvent("lab-cart-updated"));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToLabCart() {
  return [];
}

export function removeFromLabCart() {
  return [];
}

export function clearLabCart() {
  saveLabCart();
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
