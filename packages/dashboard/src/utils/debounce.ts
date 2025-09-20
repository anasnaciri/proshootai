/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified wait time has elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns A debounced version of the provided function
 *
 * @example
 * const debouncedSearch = advancedDebounce((query: string) => {
 *   // API call or expensive operation
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
