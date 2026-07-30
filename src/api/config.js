/**
 * Fetches the runtime config from /config.json (in public/), cached after
 * the first call. Keeps the API base URL editable without a rebuild.
 *
 * @returns {Promise<{apiBaseUrl: string, dateTimeFormat?: string}>}
 */
let cachedConfig = null;

export async function loadConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  const res = await fetch('/config.json');
  cachedConfig = await res.json();
  return cachedConfig;
}

export const DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy hh:mm:ss a';

/**
 * Synchronous access to the configured date/time format, for use in
 * render code that can't await loadConfig(). Falls back to the default
 * format until the config has loaded (it's always fetched before any
 * API call resolves, via getClient(), so in practice it's populated by
 * the time there's any data to display a date for).
 *
 * @returns {string}
 */
export function getDateTimeFormat() {
  return cachedConfig?.dateTimeFormat || DEFAULT_DATE_TIME_FORMAT;
}
