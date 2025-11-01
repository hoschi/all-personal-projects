/**
 * Subtitle Processing Module
 * Converts SRT subtitles to various formats using @aj-archipelago/subvibe
 * Functional programming approach with pure functions
 * 
 * https://www.perplexity.ai/search/du-bist-ein-typescript-senior-0wPQ5DjgSl.kxXYajyFLxA?preview=1#3
 */

import { parse, SubtitleUtils, type SubtitleCue } from '@aj-archipelago/subvibe';

export interface LLMFormatEntry {
  time: string;
  text: string;
}

/**
 * Parse and normalize SRT content
 * Only removes formatting, fixes timings, and cleans up whitespace
 */
export const parseSRT = (srtContent: string): SubtitleCue[] => {
  const normalizeOptions = {
    format: 'srt' as const,
    removeFormatting: true,
    fixTimings: true,
    removeEmpty: true,
    cleanupSpacing: true
  };

  const parsed = parse(srtContent);
  const normalized = SubtitleUtils.normalize(parsed.cues, normalizeOptions);

  return normalized;
};

/**
 * Format milliseconds to HH:MM:SS format
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Round timestamp to nearest interval (for token optimization)
 */
const roundToInterval = (ms: number, interval: number): number => {
  return Math.floor(ms / interval) * interval;
};

/**
 * Convert SRT content to plain text format
 * Removes all timestamps and line breaks, outputs single continuous text
 */
export const toPlainText = (srtContent: string): string => {
  const cues = parseSRT(srtContent);

  return cues
    .map(cue => cue.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Convert SRT content to LLM-optimized format
 * Aggregates subtitles into intervals (default 20 seconds) to reduce token usage
 */
export const toLLMFormat = (
  srtContent: string,
  intervalSeconds: number = 20
): LLMFormatEntry[] => {
  const cues = parseSRT(srtContent);

  if (cues.length === 0) return [];

  const interval = intervalSeconds * 1000; // Convert to milliseconds
  const result: LLMFormatEntry[] = [];

  for (const cue of cues) {
    const roundedStart = roundToInterval(cue.startTime, interval);
    const timeStr = formatTime(roundedStart);
    const lastEntry = result[result.length - 1];

    if (lastEntry && lastEntry.time === timeStr) {
      // Append to existing entry
      lastEntry.text = (lastEntry.text + ' ' + cue.text).trim();
    } else {
      // Create new entry
      result.push({
        time: timeStr,
        text: cue.text
      });
    }
  }

  return result;
};
