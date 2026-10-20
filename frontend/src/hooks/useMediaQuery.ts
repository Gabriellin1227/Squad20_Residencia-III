import { useEffect, useState } from 'react'

/**
 * Use só quando o CSS não resolver, por exemplo para trocar um componente inteiro.
 * Ex.: const isDesktop = useMediaQuery('(min-width: 992px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
