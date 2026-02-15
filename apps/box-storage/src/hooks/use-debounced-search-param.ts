import { INPUT_DEBOUNCE_MS } from "@/constants"
import { useEffect, useEffectEvent, useState } from "react"

// TODO Die TS Typen in den hooks sind nicht gut. Die creator Funktionen sind gut, da sie die konkrete Route bekommen. Das ist sinnvoll, aber nur wenn man das route object bzw den konkreten Typen übernimmt um dann die erzeugten Funktionen zu sichern! Ziel des ganzen ist das in die erzeugten Funktionen nur valide Argumente die zur route passen hineingereicht werden können. `searchKey` muss einen TS Fehler melden wenn man einen string rein gibt der eben nicht im `search` Objekt der Routen enthalten ist. Das beim aufrufen der Funktion `<typeof search>` überhaupt mit gegeben werden muss um das zu erreichen ist falsch, da `route` diese Typinformationen ja schon hat.

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
    TCurrentSearch extends TSearch,
    TKey extends keyof TCurrentSearch & string = keyof TCurrentSearch & string,
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
