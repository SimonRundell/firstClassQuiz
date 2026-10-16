<?php
/**
 * sanitize.php
 *
 * Server-side allowlist HTML sanitiser for rich text (question prompts and
 * free-text answers). Only the tags the Tiptap editor can produce are kept,
 * every attribute is dropped, and script/style content is removed entirely.
 * The client also sanitises on render (DOMPurify), this is defence in depth
 * so hostile markup never reaches the database.
 */

/**
 * @param string $html Untrusted HTML.
 * @return string Safe HTML containing only allowlisted tags and no attributes.
 */
function sanitize_html($html): string
{
    $html = (string)$html;
    if (trim($html) === '') {
        return '';
    }

    $allowed = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
        'ul', 'ol', 'li', 'blockquote', 'hr', 'sub', 'sup',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    ];
    $dropWithContent = ['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template'];

    $doc = new DOMDocument();
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><body><div id="fcq-root">' . $html . '</div></body>');
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    $root = $doc->getElementById('fcq-root');
    if (!$root) {
        return htmlspecialchars(strip_tags($html), ENT_QUOTES, 'UTF-8');
    }

    $clean = function (DOMNode $node) use (&$clean, $allowed, $dropWithContent) {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child->nodeType === XML_ELEMENT_NODE) {
                $name = strtolower($child->nodeName);

                if (in_array($name, $dropWithContent, true)) {
                    $node->removeChild($child);
                    continue;
                }

                $clean($child);

                if (in_array($name, $allowed, true)) {
                    foreach (iterator_to_array($child->attributes) as $attr) {
                        $child->removeAttributeNode($attr);
                    }
                } else {
                    while ($child->firstChild) {
                        $node->insertBefore($child->firstChild, $child);
                    }
                    $node->removeChild($child);
                }
            } elseif ($child->nodeType !== XML_TEXT_NODE) {
                $node->removeChild($child);
            }
        }
    };
    $clean($root);

    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }

    return $out;
}
