/**
 * Erkennt YouTube-Video-Stub-Pfade nach Plugin-Konvention
 * <vaultRoot>/youtube/<channelName>/<title>.md.
 */
export const isStubPath = (
  filePath: string,
  vaultRootPath: string,
): boolean => {
  if (filePath.length === 0 || vaultRootPath.length === 0) return false
  const prefix = vaultRootPath.endsWith("/")
    ? `${vaultRootPath}youtube/`
    : `${vaultRootPath}/youtube/`
  return filePath.startsWith(prefix)
}

/**
 * Extrahiert den Channel-Namen aus einem Stub-Pfad.
 * Erwartet: <vaultRoot>/youtube/<channelName>/<title>.md
 * Gibt null zurück, wenn filePath kein Stub-Pfad ist.
 * URL-dekodiert den Channel-Namen-Segment.
 */
export const extractChannelFromStubPath = (
  filePath: string,
  vaultRootPath: string,
): string | null => {
  if (isStubPath(filePath, vaultRootPath) === false) return null
  const prefix = vaultRootPath.endsWith("/")
    ? `${vaultRootPath}youtube/`
    : `${vaultRootPath}/youtube/`
  const rest = filePath.slice(prefix.length)
  const slash = rest.indexOf("/")
  if (slash <= 0) return null
  const segment = rest.slice(0, slash)
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}
