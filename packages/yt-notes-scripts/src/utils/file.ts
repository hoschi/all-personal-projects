// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

const ILLEGAL_CHARS_REGEX = /[<>:"/\\|?*]/g
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_REGEX = /[\x00-\x1f\x7f]/g
const WINDOWS_RESERVED_REGEX = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i
const TRAILING_DOTS_OR_SPACES = /[. ]+$/
const MAX_BYTES = 255

const truncateToBytes = (input: string, maxBytes: number): string => {
  const enc = new TextEncoder()
  const dec = new TextDecoder("utf-8")
  const bytes = enc.encode(input)
  if (bytes.length <= maxBytes) return input
  let cut = maxBytes
  while (cut > 0 && (bytes[cut] & 0b11000000) === 0b10000000) cut--
  return dec.decode(bytes.subarray(0, cut))
}

export const sanitizeFilename = (text: string, replacement = "_"): string => {
  if (!text) return ""
  let result = text
    .replace(ILLEGAL_CHARS_REGEX, replacement)
    .replace(CONTROL_CHARS_REGEX, replacement)
  if (WINDOWS_RESERVED_REGEX.test(result)) {
    result = `${replacement}${result}`
  }
  result = result.replace(TRAILING_DOTS_OR_SPACES, "")
  result = truncateToBytes(result, MAX_BYTES)
  return result
}

const splitNameExt = (filePath: string): { base: string; ext: string } => {
  const lastSlash = Math.max(
    filePath.lastIndexOf("/"),
    filePath.lastIndexOf("\\"),
  )
  const dir = lastSlash >= 0 ? filePath.slice(0, lastSlash + 1) : ""
  const file = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath
  const lastDot = file.lastIndexOf(".")
  if (lastDot <= 0) {
    return { base: dir + file, ext: "" }
  }
  return { base: dir + file.slice(0, lastDot), ext: file.slice(lastDot) }
}

export const resolveFilenameConflict = (
  basePath: string,
  exists: (path: string) => boolean,
): string => {
  if (!exists(basePath)) return basePath
  const { base, ext } = splitNameExt(basePath)
  let counter = 1
  while (true) {
    const candidate = `${base} ${counter}${ext}`
    if (!exists(candidate)) return candidate
    counter++
  }
}
