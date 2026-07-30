/**
 * Strips HTML tags down to plain text, for contexts that can't render
 * markup (compact list rows, CSV export, plain-text validation messages).
 *
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').trim();
}
