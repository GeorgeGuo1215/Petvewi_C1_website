export function getInitials(name: string) {
  return name
    .replace(/^(Mr\.|Ms\.|Dr\.|Prof\.)\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
