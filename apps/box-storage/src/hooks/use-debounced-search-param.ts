import { INPUT_DEBOUNCE_MS } from "@/constants"
import { useEffect, useEffectEvent, useState } from "react"

type RouteSearchApi<TSearch extends Record<string, string>> = {
  useSearch: () => TSearch
  useNavigate: () => (options: { replace: true; search: TSearch }) => void
}

export function createUseUpdateSearch<TSearch extends Record<string, string>>(
  route: RouteSearchApi<TSearch>,
) {
  return function useUpdateSearch() {
    const navigate = route.useNavigate()
    const search = route.useSearch()

    const updateSearch = (partial: Partial<TSearch>) => {
      const nextSearch = { ...search, ...partial }
      navigate({
        replace: true,
        search: nextSearch,
      })
    }

    const updateSearchKey = <TKey extends keyof TSearch & string>(
      key: TKey,
      value: TSearch[TKey],
    ) => {
      const nextSearch = { ...search }
      nextSearch[key] = value
      navigate({
        replace: true,
        search: nextSearch,
      })
    }

    return { updateSearch, updateSearchKey }
  }
}

export function createUseDebouncedSearchParam<
  TSearch extends Record<string, string>,
>(route: RouteSearchApi<TSearch>, defaultDebounceMs = INPUT_DEBOUNCE_MS) {
  const useUpdateSearch = createUseUpdateSearch(route)

  return function useDebouncedSearchParam<
    TKey extends keyof TSearch & string = keyof TSearch & string,
  >(searchKey: TKey, debounceMs = defaultDebounceMs) {
    const { updateSearchKey } = useUpdateSearch()
    const search = route.useSearch()
    const searchValue = search[searchKey]
    const [localValue, setLocalValue] = useState(searchValue)
    const commitDebouncedSearch = useEffectEvent(() => {
      updateSearchKey(searchKey, localValue)
    })

    useEffect(() => {
      setLocalValue(searchValue)
    }, [searchValue])

    useEffect(() => {
      if (localValue === searchValue) {
        return
      }

      const timer = setTimeout(() => {
        commitDebouncedSearch()
      }, debounceMs)

      return () => clearTimeout(timer)
    }, [debounceMs, localValue, searchKey, searchValue])

    return [localValue, setLocalValue] as const
  }
}
