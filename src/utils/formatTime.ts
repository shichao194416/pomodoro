/**
 * Converts seconds to MM:SS format for countdown display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string in MM:SS format (e.g., "02:05")
 */
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses a user-entered time string into total seconds.
 * Accepts formats: "MM:SS", "MM", or bare digits.
 * Returns null if input is invalid.
 */
export const parseTimeInput = (input: string): number | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let minutes: number;
  let seconds: number;

  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    if (parts.length !== 2) return null;
    minutes = parseInt(parts[0], 10);
    seconds = parseInt(parts[1], 10);
  } else {
    minutes = parseInt(trimmed, 10);
    seconds = 0;
  }

  if (isNaN(minutes) || isNaN(seconds)) return null;
  if (minutes < 0 || minutes > 60) return null;
  if (seconds < 0 || seconds > 59) return null;

  const total = minutes * 60 + seconds;
  if (total <= 0) return null;

  return total;
};

export interface DurationUnits {
  hour: string;
  minute: string;
}

/**
 * Formats a study duration using the caller's own unit words, so the result
 * reads naturally in every language ("1 小时 25 分钟", "1 h 25 min").
 * Sub-minute amounts are rounded up to a single minute rather than showing
 * fake precision.
 */
export const formatStudyTime = (seconds: number, units: DurationUnits): string => {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);

  if (hours > 0) {
    return minutes > 0
      ? `${hours} ${units.hour} ${minutes} ${units.minute}`
      : `${hours} ${units.hour}`;
  }
  if (total === 0) return `0 ${units.minute}`;
  return `${Math.max(1, minutes)} ${units.minute}`;
};

/**
 * Converts seconds to human-readable duration for statistics display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string like "5m 30s" or "2m" or "45 seconds"
 */
export const formatTimeDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};
