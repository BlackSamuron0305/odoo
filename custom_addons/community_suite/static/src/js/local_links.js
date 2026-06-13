/** @odoo-module **/

import { whenReady } from "@web/core/utils/when_ready";

const ODOO_HOST_RE = /(?:^|\.)odoo\.(?:com|de)$/i;
const APPS_ODOO_RE = /^apps\.odoo\.com$/i;

export function rewriteOdooUrl(url) {
    if (!url) {
        return url;
    }
    try {
        const parsed = new URL(url, window.location.origin);
        if (!ODOO_HOST_RE.test(parsed.hostname) && !APPS_ODOO_RE.test(parsed.hostname)) {
            return url;
        }
        const docMatch = url.match(/documentation\/[\d.~\-]+(?:\/[^/?#]+)?\/(.+)/);
        if (docMatch) {
            return `/web/documentation/${docMatch[1]}`;
        }
        const appMatch = url.match(/\/app\/([^/?#]+)/);
        if (appMatch) {
            return `/web/apps/learn/${appMatch[1].replace(/-/g, "_")}`;
        }
        if (/pricing|buy|upgrade|enterprise|editions/.test(url)) {
            return "/odoo/apps";
        }
        return "/odoo/apps";
    } catch {
        return url;
    }
}

function sanitizeAnchors(root = document) {
    for (const anchor of root.querySelectorAll(
        'a[href*="odoo.com"], a[href*="odoo.de"], a[href*="apps.odoo"]'
    )) {
        const rewritten = rewriteOdooUrl(anchor.href);
        if (rewritten !== anchor.href) {
            anchor.href = rewritten;
            anchor.removeAttribute("target");
        }
    }
}

whenReady(() => {
    sanitizeAnchors();
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    sanitizeAnchors(node);
                }
            }
        }
    });
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
