import { describe, it, expect } from 'bun:test';
import {
  parseSRT,
  formatTime,
  toPlainText,
  toLLMFormat,
  type LLMFormatEntry
} from './subtitle-processors';

// ============================================================================
// Test Data with Template Strings
// ============================================================================

const basicSRT = `1
00:00:01,000 --> 00:00:04,000
Hallo, Welt!

2
00:00:05,000 --> 00:00:08,500
Das ist eine Subtitle-Datei`;

const srtWithFormatting = `1
00:00:01,000 --> 00:00:04,000
<i>Italic Text</i> und {bold}Bold{/bold}

2
00:00:05,000 --> 00:00:08,500
<font color="red">Colored</font> Text`;

const srtWithExtraWhitespace = `1
00:00:01,000 --> 00:00:04,000
Text   with    extra     spaces


2
00:00:05,000 --> 00:00:08,500
Multiple


Line
Breaks`;

const srtWithEmptyLines = `1
00:00:01,000 --> 00:00:04,000
Normal text

2
00:00:05,000 --> 00:00:08,500


3
00:00:10,000 --> 00:00:12,000
Another line`;

const srtMultilineText = `1
00:00:01,000 --> 00:00:04,000
First line
Second line
Third line

2
00:00:05,000 --> 00:00:08,500
Another first line
Another second line`;

const srtWithCommaTimestamps = `1
00:00:01,000 --> 00:00:04,000
Text with comma separator

2
00:00:05,000 --> 00:00:08,500
Another line`;

const srtWithDotTimestamps = `1
00:00:01.000 --> 00:00:04.000
Text with dot separator

2
00:00:05.000 --> 00:00:08.500
Another line`;

const largeTimestampSRT = `1
02:30:45,500 --> 02:30:50,750
Large timestamp example

2
02:45:30,000 --> 02:45:35,000
Another large timestamp`;

const srtWithSpecialCharacters = `1
00:00:01,000 --> 00:00:04,000
Hällö Wörld! © 2025 & friends

2
00:00:05,000 --> 00:00:08,500
Special chars: @#$%^&*()_+-=[]{}|;:,.<>?`;

const malformedSRT = `This is not a valid SRT

Random text without proper formatting

1
00:00:01,000 --> 00:00:04,000
Valid entry after garbage`;

const emptySRT = '';

const multipleFormattingTagsSRT = `1
00:00:01,000 --> 00:00:04,000
<b>Bold <i>and italic</i></b> <u>underlined</u>

2
00:00:05,000 --> 00:00:08,500
{speaker:John} <v>Named voice</v> text`;

const srtForLLMAggregation = `1
00:00:05,000 --> 00:00:06,000
First subtitle

2
00:00:15,000 --> 00:00:16,000
Second subtitle

3
00:00:25,000 --> 00:00:26,000
Third subtitle

4
00:00:40,000 --> 00:00:41,000
Fourth subtitle

5
00:00:55,000 --> 00:00:56,000
Fifth subtitle`;

const denseSRT = `1
00:00:01,000 --> 00:00:02,000
Text1

2
00:00:02,100 --> 00:00:03,000
Text2

3
00:00:03,100 --> 00:00:04,000
Text3

4
00:00:04,100 --> 00:00:05,000
Text4`;

// ============================================================================
// PARSER TESTS
// ============================================================================

describe('parseSRT', () => {
  it('should parse basic SRT correctly', () => {
    const result = parseSRT(basicSRT);
    expect(result.length).toBe(2);
    expect(result[0].index).toBe(1);
    expect(result[0].startTime).toBe(1000);
    expect(result[0].endTime).toBe(4000);
    expect(result[0].text).toBe('Hallo, Welt!');
  });

  it('should handle multiline text in subtitles', () => {
    const result = parseSRT(srtMultilineText);
    expect(result[0].text).toContain('First line');
    expect(result[0].text).toContain('Second line');
    expect(result[0].text).toContain('Third line');
  });

  it('should parse timestamps with comma separators', () => {
    const result = parseSRT(srtWithCommaTimestamps);
    expect(result[0].startTime).toBe(1000);
    expect(result[0].endTime).toBe(4000);
  });

  it('should parse timestamps with dot separators', () => {
    const result = parseSRT(srtWithDotTimestamps);
    expect(result[0].startTime).toBe(1000);
    expect(result[0].endTime).toBe(4000);
  });

  it('should handle large timestamps', () => {
    const result = parseSRT(largeTimestampSRT);
    const expectedStart = 2 * 3600000 + 30 * 60000 + 45 * 1000 + 500;
    expect(result[0].startTime).toBe(expectedStart);
  });

  it('should preserve special characters', () => {
    const result = parseSRT(srtWithSpecialCharacters);
    expect(result[0].text).toContain('©');
    expect(result[0].text).toContain('&');
  });

  it('should handle malformed SRT gracefully', () => {
    const result = parseSRT(malformedSRT);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return empty array for empty SRT', () => {
    const result = parseSRT(emptySRT);
    expect(result.length).toBe(0);
  });

  it('should remove formatting tags during parsing', () => {
    const result = parseSRT(srtWithFormatting);
    expect(result[0].text).not.toContain('<i>');
    expect(result[0].text).not.toContain('</i>');
    expect(result[0].text).toContain('Italic Text');
  });

  it('should remove empty subtitles', () => {
    const result = parseSRT(srtWithEmptyLines);
    const emptyCount = result.filter(c => c.text.trim().length === 0).length;
    expect(emptyCount).toBe(0);
  });

  it('should cleanup extra whitespace', () => {
    const result = parseSRT(srtWithExtraWhitespace);
    expect(result[0].text).not.toContain('   ');
  });

  it('should calculate correct timestamp in milliseconds', () => {
    const result = parseSRT(basicSRT);
    expect(result[1].startTime).toBe(5000);
    expect(result[1].endTime).toBe(8500);
  });

  it('should handle multiple formatting types', () => {
    const result = parseSRT(multipleFormattingTagsSRT);
    expect(result[0].text).not.toContain('<b>');
    expect(result[0].text).not.toContain('{speaker:');
  });
});

// ============================================================================
// TIME FORMATTING TESTS
// ============================================================================

describe('formatTime', () => {
  it('should format milliseconds to HH:MM:SS', () => {
    const result = formatTime(3661000); // 1 hour, 1 minute, 1 second
    expect(result).toBe('01:01:01');
  });

  it('should handle zero milliseconds', () => {
    const result = formatTime(0);
    expect(result).toBe('00:00:00');
  });

  it('should pad single digits with leading zeros', () => {
    const result = formatTime(61000); // 1 minute, 1 second
    expect(result).toBe('00:01:01');
  });

  it('should handle large timestamps', () => {
    const result = formatTime(2 * 3600000 + 30 * 60000 + 45 * 1000);
    expect(result).toBe('02:30:45');
  });

  it('should handle seconds only', () => {
    const result = formatTime(5000);
    expect(result).toBe('00:00:05');
  });

  it('should handle 5 seconds', () => {
    const result = formatTime(5000);
    expect(result).toBe('00:00:05');
  });

  it('should handle 1 minute', () => {
    const result = formatTime(60000);
    expect(result).toBe('00:01:00');
  });

  it('should handle fractional milliseconds correctly', () => {
    const result = formatTime(5500);
    expect(result).toBe('00:00:05');
  });

  it('should format time with all units', () => {
    const result = formatTime(3661500);
    expect(result).toBe('01:01:01');
  });
});

// ============================================================================
// PLAIN TEXT CONVERSION TESTS
// ============================================================================

describe('toPlainText', () => {
  it('should convert SRT to single line text', () => {
    const result = toPlainText(basicSRT);
    expect(result).not.toContain('\n');
    expect(result).not.toContain('00:00');
  });

  it('should join multiple cues with spaces', () => {
    const result = toPlainText(basicSRT);
    expect(result).toContain('Hallo, Welt!');
    expect(result).toContain('Datei');
  });

  it('should remove extra whitespace', () => {
    const result = toPlainText(srtWithExtraWhitespace);
    expect(result).not.toContain('   ');
  });

  it('should handle empty SRT', () => {
    const result = toPlainText(emptySRT);
    expect(result).toBe('');
  });

  it('should trim result', () => {
    const result = toPlainText(basicSRT);
    expect(result.startsWith(' ')).toBe(false);
    expect(result.endsWith(' ')).toBe(false);
  });

  it('should preserve text content', () => {
    const result = toPlainText(srtWithSpecialCharacters);
    expect(result).toContain('©');
    expect(result).toContain('&');
  });

  it('should remove formatting tags', () => {
    const result = toPlainText(srtWithFormatting);
    expect(result).not.toContain('<');
    expect(result).not.toContain('{bold}');
  });

  it('should handle multiline text properly', () => {
    const result = toPlainText(srtMultilineText);
    expect(result).toContain('First line');
    expect(result).toContain('Third line');
    expect(result).not.toContain('\n');
  });

  it('should produce continuous text without timestamps', () => {
    const result = toPlainText(basicSRT);
    expect(result.includes('00:00')).toBe(false);
    expect(result.includes('-->')).toBe(false);
  });
});

// ============================================================================
// LLM FORMAT CONVERSION TESTS
// ============================================================================

describe('toLLMFormat', () => {
  it('should create LLM format with timestamps', () => {
    const result = toLLMFormat(basicSRT);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('time');
    expect(result[0]).toHaveProperty('text');
  });

  it('should aggregate cues within same 20-second interval', () => {
    const result = toLLMFormat(srtForLLMAggregation, 20);
    // Subtitles at 5s, 15s should be in same interval (0-20s)
    const firstIntervalEntries = result.filter(e => e.time === '00:00:00');
    expect(firstIntervalEntries.length).toBe(1);
  });

  it('should create separate entries for different intervals', () => {
    const result = toLLMFormat(srtForLLMAggregation, 20);
    // Should have multiple entries for subtitles across different intervals
    expect(result.length).toBeGreaterThan(1);
  });

  it('should use custom interval', () => {
    const result10s = toLLMFormat(srtForLLMAggregation, 10);
    const result20s = toLLMFormat(srtForLLMAggregation, 20);
    // Smaller interval should produce more entries
    expect(result10s.length).toBeGreaterThanOrEqual(result20s.length);
  });

  it('should format time correctly', () => {
    const result = toLLMFormat(basicSRT);
    expect(result[0].time).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('should handle empty SRT', () => {
    const result = toLLMFormat(emptySRT);
    expect(result).toEqual([]);
  });

  it('should concatenate text from same interval', () => {
    const result = toLLMFormat(denseSRT, 20);
    // All dense subtitles should aggregate into first interval
    expect(result[0].text.split(' ').length).toBeGreaterThan(1);
  });

  it('should maintain chronological order', () => {
    const result = toLLMFormat(srtForLLMAggregation);
    for (let i = 1; i < result.length; i++) {
      const prevTime = parseTimeToMs(result[i - 1].time);
      const currTime = parseTimeToMs(result[i].time);
      expect(currTime).toBeGreaterThanOrEqual(prevTime);
    }
  });

  it('should handle 30 second interval correctly', () => {
    const result = toLLMFormat(srtForLLMAggregation, 30);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should round down to interval boundary', () => {
    const result = toLLMFormat(basicSRT, 20);
    // All times should be multiples of 20 seconds (0, 20, 40, etc.)
    result.forEach(entry => {
      const seconds = parseTimeToMs(entry.time) / 1000;
      expect(seconds % 20).toBe(0);
    });
  });

  it('should handle subtitles at exact interval boundaries', () => {
    const srtExactBoundary = `1
00:00:20,000 --> 00:00:21,000
At boundary

2
00:00:40,000 --> 00:00:41,000
Another boundary`;

    const result = toLLMFormat(srtExactBoundary, 20);
    expect(result.length).toBe(2);
    expect(result[0].time).toBe('00:00:20');
    expect(result[1].time).toBe('00:00:40');
  });

  it('should remove formatting from LLM format text', () => {
    const result = toLLMFormat(srtWithFormatting);
    result.forEach(entry => {
      expect(entry.text).not.toContain('<');
      expect(entry.text).not.toContain('{bold}');
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration', () => {
  it('should handle real-world scenario with formatting and dense subtitles', () => {
    const complexSRT = `1
00:00:01,000 --> 00:00:02,000
<i>First</i> formatted subtitle

2
00:00:02,500 --> 00:00:03,500
Second subtitle

3
00:00:03,600 --> 00:00:04,500
Dense subtitle

4
00:00:25,000 --> 00:00:26,000
Later subtitle`;

    const plainText = toPlainText(complexSRT);
    const llmFormat = toLLMFormat(complexSRT);

    expect(plainText).not.toContain('<i>');
    expect(plainText).not.toContain('00:00');
    expect(llmFormat.length).toBeGreaterThan(0);
    expect(llmFormat[0]).toHaveProperty('time');
    expect(llmFormat[0]).toHaveProperty('text');
  });

  it('should be deterministic (same input produces same output)', () => {
    const result1 = toPlainText(basicSRT);
    const result2 = toPlainText(basicSRT);
    expect(result1).toBe(result2);

    const llmResult1 = toLLMFormat(basicSRT);
    const llmResult2 = toLLMFormat(basicSRT);
    expect(JSON.stringify(llmResult1)).toBe(JSON.stringify(llmResult2));
  });

  it('should handle very long subtitle content', () => {
    const longText = 'a'.repeat(5000);
    const srt = `1
00:00:01,000 --> 00:00:05,000
${longText}`;
    const result = parseSRT(srt);
    expect(result.length).toBe(1);
    expect(result[0].text.length).toBe(5000);
  });

  it('should handle many subtitles efficiently', () => {
    let srt = '';
    for (let i = 0; i < 100; i++) {
      const seconds = String(i * 5).padStart(2, '0');
      srt += `${i + 1}\n00:00:${seconds},000 --> 00:00:${String(i * 5 + 4).padStart(2, '0')},000\nSubtitle ${i + 1}\n\n`;
    }
    const result = toLLMFormat(srt);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should reduce entry count with larger intervals', () => {
    const result10s = toLLMFormat(srtForLLMAggregation, 10);
    const result20s = toLLMFormat(srtForLLMAggregation, 20);
    expect(result20s.length).toBeLessThanOrEqual(result10s.length);
  });

  it('should preserve all text content across formats', () => {
    const plainText = toPlainText(basicSRT);
    const llmFormat = toLLMFormat(basicSRT);
    const llmText = llmFormat.map(e => e.text).join(' ');

    expect(plainText).toBe(llmText);
  });

  it('should handle edge case with single subtitle', () => {
    const singleSRT = `1
00:00:01,000 --> 00:00:04,000
Only one subtitle`;

    const plain = toPlainText(singleSRT);
    const llm = toLLMFormat(singleSRT);

    expect(plain).toBe('Only one subtitle');
    expect(llm.length).toBe(1);
    expect(llm[0].text).toBe('Only one subtitle');
  });
});

// ============================================================================
// HELPER FUNCTIONS FOR TESTS
// ============================================================================

/**
 * Parse HH:MM:SS to milliseconds for testing
 */
const parseTimeToMs = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
};
