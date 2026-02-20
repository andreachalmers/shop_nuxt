/**
 * Debounce
 */
export function debounce(
  fn: (...args: unknown[]) => void,
  wait = 300
): (...args: unknown[]) => void {
  let t: ReturnType<typeof setTimeout> | null = null
  return (...args: unknown[]) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}
