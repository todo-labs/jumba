import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useDebounce<T>(
  value: T,
  delay: number
): [T, Dispatch<SetStateAction<T>>] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
}
