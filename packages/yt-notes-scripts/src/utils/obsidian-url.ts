// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

/**
 * Encodes a vault-relative path for use in obsidian:// URLs.
 * Input MUST be a raw vault-relative path. Pre-encoded input will be double-encoded.
 */
export const encodeObsidianPath = (path: string): string => {
  if (!path) return ""
  return path.split("/").map(encodeURIComponent).join("/")
}

export const buildObsidianUrl = (
  vaultName: string,
  vaultRelativePath: string,
): string => {
  return `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeObsidianPath(vaultRelativePath)}`
}
