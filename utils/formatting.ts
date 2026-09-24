/**
 * Formats seconds into MM:SS string.
 */
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds into human readable duration e.g. "12m 30s" or "45s" or "1h 15m"
 */
export function formatDurationHuman(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '0s';
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Formats percentage number
 */
export function formatPercentage(value: number): string {
  if (isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}

/**
 * Word count helper
 */
export function getWordCount(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  const words = text.trim().split(/\s+/);
  return words[0] === '' ? 0 : words.length;
}

/**
 * Truncate long text
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
