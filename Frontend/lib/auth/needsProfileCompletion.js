const PLACEHOLDER_EMAIL = /@(firebase|dev)\.medzoos\.local$/i;

export function needsProfileCompletion(user) {
  if (!user) return false;
  const name = String(user.name || "").trim();
  if (name.length >= 2) return false;
  const email = String(user.email || "").trim();
  return !email || PLACEHOLDER_EMAIL.test(email);
}
