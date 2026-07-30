import { getDateTimeFormat } from '../api/config';

/** @param {number} n @returns {string} */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Formats a date using the configured dateTimeFormat (public/config.json),
 * defaulting to dd/MM/yyyy hh:mm:ss a (e.g. 30/07/2026 02:15:30 PM).
 *
 * Supported tokens: yyyy, MM, dd, HH (24hr), hh (12hr), mm, ss, a (AM/PM).
 *
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  const format = getDateTimeFormat();

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;

  return format
    .replace(/yyyy/g, date.getFullYear())
    .replace(/dd/g, pad2(date.getDate()))
    .replace(/MM/g, pad2(date.getMonth() + 1))
    .replace(/HH/g, pad2(hours24))
    .replace(/hh/g, pad2(hours12))
    .replace(/mm/g, pad2(date.getMinutes()))
    .replace(/ss/g, pad2(date.getSeconds()))
    .replace(/a/g, hours24 >= 12 ? 'PM' : 'AM');
}
