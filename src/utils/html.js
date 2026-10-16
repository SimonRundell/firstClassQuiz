import DOMPurify from 'dompurify';

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

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
  'ul', 'ol', 'li', 'blockquote', 'hr', 'sub', 'sup',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
];

/**
 * Sanitises rich-text HTML before it is injected with
 * dangerouslySetInnerHTML. Allows only the tags the rich text editor can
 * produce and strips every attribute, so script, event handlers and
 * links in stored content can never execute.
 *
 * @param {string} html
 * @returns {string} Safe HTML.
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR: [] });
}
