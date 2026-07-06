// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

export interface Chapter {
  timestamp: string
  title: string
}

export interface ParsedDuration {
  totalSeconds: number
  formatted: string
}

const VIDEO_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:[^&]*&)*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/

export const parseVideoId = (url: string): string | null => {
  if (!url) return null
  const match = url.match(VIDEO_ID_REGEX)
  return match ? match[1] : null
}

const CHAPTER_TIMESTAMP_REGEX = /^(\d{1,2}:)?\d{1,2}:\d{2}/

export const parseChapters = (description: string): Chapter[] => {
  if (!description) return []
  const chapters: Chapter[] = []
  for (const rawLine of description.split("\n")) {
    const line = rawLine.trimStart()
    const match = line.match(CHAPTER_TIMESTAMP_REGEX)
    if (!match) continue
    const timestamp = match[0]
    const title = line.slice(timestamp.length).replace(/^[\s\-–—:]+/, "")
    if (!title) continue
    chapters.push({ timestamp, title })
  }
  return chapters
}

const ISO_DURATION_REGEX = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/

export const parseISODuration = (iso: string): ParsedDuration => {
  const match = iso.match(ISO_DURATION_REGEX)
  if (!match) {
    return { totalSeconds: 0, formatted: "0:00" }
  }
  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const seconds = match[3] ? parseInt(match[3], 10) : 0
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")
  const formatted = hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`
  return { totalSeconds, formatted }
}
