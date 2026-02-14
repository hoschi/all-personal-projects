import { INPUT_DEBOUNCE_MS } from "@/constants"
import { useEffect, useState } from "react"

type RouteSearchApi<TSearch extends Record<string, string>> = {
  useSearch: () => TSearch
  useNavigate: () => (options: { replace: true; search: TSearch }) => void
}

export function createUseDebouncedSearchParam<
  TSearch extends Record<string, string>,
>(route: RouteSearchApi<TSearch>, defaultDebounceMs = INPUT_DEBOUNCE_MS) {
  return function useDebouncedSearchParam<TKey extends keyof TSearch & string>(
    searchKey: TKey,
    debounceMs = defaultDebounceMs,
  ) {
    const navigate = route.useNavigate()
    const search = route.useSearch()
    const searchValue = search[searchKey]
    const [localValue, setLocalValue] = useState(searchValue)

    useEffect(() => {
      setLocalValue(searchValue)
    }, [searchValue])

    useEffect(() => {
      if (localValue === searchValue) {
        return
      }

      const timer = setTimeout(() => {
        const nextSearch = { ...search }
        nextSearch[searchKey] = localValue
        navigate({
          replace: true,
          search: nextSearch,
        })
      }, debounceMs)

      return () => clearTimeout(timer)
    }, [debounceMs, localValue, navigate, search, searchKey, searchValue])

    return [localValue, setLocalValue] as const
  }
}
