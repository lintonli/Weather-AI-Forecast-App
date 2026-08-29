export function parseCoord(value: unknown, min: number, max: number): number | null {
  const num = Number(value);
  if (!Number.isFinite(num) || num < min || num > max) return null;
  return num;
}
