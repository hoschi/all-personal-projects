export type Patch = {
  start: number
  end: number
  oldUrl: string
  newUrl: string
}

const encodeVaultRelativePath = (vaultRelative: string): string =>
  vaultRelative.split("/").map(encodeURIComponent).join("%2F")

export const findUrlsToStub = (
  content: string,
  stubVaultRelativePath: string,
  sharedVaultName: string,
  sourceRoot: "shared" | "private",
  targetRoot: "shared" | "private",
): Patch[] => {
  // Obsidian erlaubt beide Schreibweisen: mit und ohne .md-Endung
  const pathNoExt = stubVaultRelativePath.endsWith(".md")
    ? stubVaultRelativePath.slice(0, -3)
    : stubVaultRelativePath
  const variants = [pathNoExt, pathNoExt + ".md"]

  const patches: Patch[] = []
  for (const variant of variants) {
    const encoded = encodeVaultRelativePath(variant)
    const sourceUrl = `obsidian://open?vault=${sharedVaultName}&file=${sourceRoot}%2F${encoded}`
    const targetUrl = `obsidian://open?vault=${sharedVaultName}&file=${targetRoot}%2F${encoded}`

    let idx = 0
    while ((idx = content.indexOf(sourceUrl, idx)) !== -1) {
      // Grenze prüfen: Der Treffer darf nur matchen wenn danach ein URL-Abschluss
      // folgt, nicht ein weiteres Pfad-Zeichen (z.B. %20 bei "Title 2").
      // Erlaubt: ), &, Whitespace, Ende-des-Strings (& für &line=N-Suffixe).
      const charAfter = content[idx + sourceUrl.length]
      const bounded =
        charAfter === undefined ||
        charAfter === ")" ||
        charAfter === "&" ||
        charAfter === " " ||
        charAfter === "\n" ||
        charAfter === "\t" ||
        charAfter === "\r"
      if (bounded) {
        patches.push({
          start: idx,
          end: idx + sourceUrl.length,
          oldUrl: sourceUrl,
          newUrl: targetUrl,
        })
      }
      idx += sourceUrl.length
    }
  }

  // dedup: wenn zwei Varianten an derselben Position matchen (z.B. ".md" und kein ".md"),
  // behalte die längere (spezifischere) Übereinstimmung
  const seen = new Map<number, Patch>()
  for (const p of patches) {
    const existing = seen.get(p.start)
    if (!existing || p.end > existing.end) seen.set(p.start, p)
  }
  const deduped = [...seen.values()]
  deduped.sort((a, b) => a.start - b.start)
  return deduped
}

export const applyPatches = (content: string, patches: Patch[]): string => {
  if (patches.length === 0) return content
  let out = content
  // reverse-sort by start so splices don't shift later positions
  for (const p of [...patches].sort((a, b) => b.start - a.start)) {
    out = out.slice(0, p.start) + p.newUrl + out.slice(p.end)
  }
  return out
}
