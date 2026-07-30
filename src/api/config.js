/**
 * Fetches the runtime config from /config.json (in public/), cached after
 * the first call. Keeps the API base URL editable without a rebuild.
 *
 * @returns {Promise<{apiBaseUrl: string}>}
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
