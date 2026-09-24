/** Public files need an explicit prefix; Next Link prefixes routes itself. */
export function assetPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}` : path;
}
