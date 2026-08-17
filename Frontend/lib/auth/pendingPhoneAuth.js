let pending = null;

export function setPendingPhoneAuth(value) {
  pending = value;
}

export function getPendingPhoneAuth() {
  return pending;
}

export function clearPendingPhoneAuth() {
  pending = null;
}
