// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

export interface TemplateSettings {
  chapterFormat: string
  hashtagFormat: string
}

const TEMPLATE_KEY_REGEX = /\{\{(\w+)\}\}/g

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const renderList = (
  items: string[],
  itemFormat: string,
  placeholder: string,
): string => {
  const re = new RegExp(`\\{\\{${escapeRegex(placeholder)}\\}\\}`, "g")
  return items.map((item) => itemFormat.replace(re, item)).join("")
}

export const processTemplate = (
  template: string,
  data: Record<string, unknown>,
  settings: TemplateSettings,
): string => {
  return template.replace(TEMPLATE_KEY_REGEX, (_match, key: string) => {
    if (key === "chapters" && Array.isArray(data.chapters)) {
      return renderList(
        data.chapters as string[],
        settings.chapterFormat,
        "chapter",
      )
    }
    if (key === "hashtags" && Array.isArray(data.hashtags)) {
      return renderList(
        data.hashtags as string[],
        settings.hashtagFormat,
        "hashtag",
      )
    }
    const value = data[key]
    return value == null ? "" : String(value)
  })
}
