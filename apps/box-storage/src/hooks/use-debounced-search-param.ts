import { useEffect, useRef } from "react"

export function useDebouncedSearchParam<TValue>(
  localValue: TValue,
  searchValue: TValue,
  onDebouncedChange: (value: TValue) => void,
  debounceMs: number,
) {
  const onDebouncedChangeRef = useRef(onDebouncedChange)

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange
  }, [onDebouncedChange])

  useEffect(() => {
    if (localValue === searchValue) {
      return
    }

    const timer = setTimeout(() => {
      onDebouncedChangeRef.current(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [debounceMs, localValue, searchValue])
}
