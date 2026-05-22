// @odoo-module ignore

/* eslint-disable no-restricted-globals */
const cacheName = "odoo-sw-cache";
// Sprint 5: separate cache buckets
const STATIC_CACHE = "odoo-static-v1";
const IMAGE_CACHE  = "odoo-images-v1";
const homepageURL = "/odoo";
const offLineURL = `${homepageURL}/offline`;

// Sprint 5: static asset patterns to cache-first (JS, CSS, fonts, icons)
const STATIC_PATTERNS = [
    /\/web\/static\/.*\.(js|css|woff2?|ttf|eot|otf|svg|png|ico)(\?|$)/,
    /\/web\/assets\//,
];
// Sprint 5: image patterns — cache-first, long-lived
const IMAGE_PATTERNS = [
    /\/web\/image\//,
    /\/web\/static\/img\//,
];
// Sprint 5: API patterns — always network-first
const API_PATTERNS = [
    /\/web\/dataset\//,
    /\/web\/action\//,
    /\/odoo\/\w+\/\d+/,
];

// Sprint 5: Cache-first for static assets
async function cacheFirstStatic(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

// Sprint 5: Cache-first for images (30 day TTL via headers)
async function cacheFirstImage(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

let sessionInfo = null;

self.addEventListener("install", (event) => {
    event.waitUntil(
        Promise.all([
            // Needed because the sw is register after the initial fetch
            fetch(homepageURL).then((res) => (res.ok ? storeDataOnCache(homepageURL, res) : null)),
            // offLine Page
            caches.open(cacheName).then((cache) => cache.add(offLineURL)),
        ])
    );
});

const extractSessionInfo = (htmlContent) => {
    const match = htmlContent.match(/odoo\.__session_info__\s*=\s*({.*?});/s);
    return match && match[1] ? match[1] : null;
};

const getTextFromResponse = async (response) => {
    const reader = response.clone().body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    async function read() {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            return;
        }
        result += decoder.decode(value, { stream: true });
        await read();
    }
    await read();
    return result;
};

const storeDataOnCache = async (url, response) => {
    const htmlBody = await getTextFromResponse(response);
    // store on ram, the session info
    sessionInfo = extractSessionInfo(htmlBody);
    const cache = await caches.open(cacheName);
    return cache.put(
        url.endsWith(offLineURL) ? url : homepageURL,
        new Response(htmlBody.replace(sessionInfo, "@@@session_info_secret@@@"), {
            headers: response.headers,
        })
    );
};

const readDataOnCache = async (url) => {
    const cache = await caches.open(cacheName);
    const response = await cache.match(url);
    if (url === offLineURL) {
        return response;
    }
    // if you come from /odoo to project the url is now /odoo/project, but it doesn't exist in cache so use /odoo instead
    if (!response) {
        return readDataOnCache(homepageURL);
    }
    const htmlBody = await getTextFromResponse(response);
    return new Response(htmlBody.replaceAll("@@@session_info_secret@@@", sessionInfo), {
        headers: response.headers,
    });
};

const fetchErrorMessages = [
    "Failed to fetch", // Chromium
    "Load failed", // WebKit
    "NetworkError when attempting to fetch resource.", // Firefox
];

const navigateOrDisplayOfflinePage = async (request) => {
    const isDebugAssets = new URL(request.url).searchParams.get("debug")?.includes("assets");
    try {
        const response = await fetch(request);
        if (response.ok && !isDebugAssets) {
            storeDataOnCache(request.url, response.clone());
        }
        return response;
    } catch (requestError) {
        if (
            request.method === "GET" &&
            requestError instanceof TypeError &&
            fetchErrorMessages.includes(requestError.message)
        ) {
            if (sessionInfo?.length && !isDebugAssets) {
                const cachedResponse = await readDataOnCache(request.url);
                if (cachedResponse) {
                    return cachedResponse;
                }
            }
            const offlinePage = await readDataOnCache(offLineURL);
            if (offlinePage) {
                return offlinePage;
            }
        }
        throw requestError;
    }
};

const serveShareTarget = (event) => {
    // Redirect so the user can refresh the page without resending data.
    event.respondWith(Response.redirect("/odoo?share_target=trigger"));
    event.waitUntil(
        (async () => {
            // The page sends this message to tell the service worker it's ready to receive the file.
            await waitingMessage("odoo_share_target");
            const client = await self.clients.get(event.resultingClientId || event.clientId);
            const data = await event.request.formData();
            client.postMessage({
                shared_files: data.getAll("externalMedia") || [],
                action: "odoo_share_target_ack",
            });
        })()
    );
};

self.addEventListener("fetch", (event) => {
    if (
        event.request.method === "POST" &&
        new URL(event.request.url).searchParams.has("share_target")
    ) {
        return serveShareTarget(event);
    }

    const url = event.request.url;

    // Sprint 5: Cache-first for static assets
    if (STATIC_PATTERNS.some((p) => p.test(url))) {
        event.respondWith(cacheFirstStatic(event.request));
        return;
    }

    // Sprint 5: Cache-first for images
    if (IMAGE_PATTERNS.some((p) => p.test(url))) {
        event.respondWith(cacheFirstImage(event.request));
        return;
    }

    if (
        (event.request.mode === "navigate" && event.request.destination === "document") ||
        // request.mode = navigate isn't supported in all browsers => check for http header accept:text/html
        event.request.headers.get("accept").includes("text/html")
    ) {
        event.respondWith(navigateOrDisplayOfflinePage(event.request));
    }
});

/**
 *
 * @type {Map<String, Function[]>}
 */
const nextMessageMap = new Map();
/**
 *
 * @param message : string
 * @return {Promise}
 */
const waitingMessage = async (message) =>
    new Promise((resolve) => {
        if (!nextMessageMap.has(message)) {
            nextMessageMap.set(message, []);
        }
        nextMessageMap.get(message).push(resolve);
    });

self.addEventListener("message", (event) => {
    const messageNotifiers = nextMessageMap.get(event.data);
    if (messageNotifiers) {
        for (const messageNotified of messageNotifiers) {
            messageNotified();
        }
        nextMessageMap.delete(event.data);
    }
    if (event.data === "user_logout") {
        sessionInfo = null;
    }
});
