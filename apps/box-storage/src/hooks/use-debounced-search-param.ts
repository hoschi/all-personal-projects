import { useEffect, useRef, useState } from "react"

export function useDebouncedSearchParam<TValue>(
  searchValue: TValue,
  onDebouncedChange: (value: TValue) => void,
  debounceMs: number,
) {
  const [localValue, setLocalValue] = useState(searchValue)
  const onDebouncedChangeRef = useRef(onDebouncedChange)

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange
  }, [onDebouncedChange])

  useEffect(() => {
    setLocalValue(searchValue)
  }, [searchValue])

  useEffect(() => {
    if (localValue === searchValue) {
      return
    }

    const timer = setTimeout(() => {
      onDebouncedChangeRef.current(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [debounceMs, localValue, searchValue])

  return [localValue, setLocalValue] as const
}
