const fetch = require("node-fetch");

const cache = new Map(); // In-memory cache
const CACHE_TTL = 60 * 5 * 1000; // 5 minutes (adjust as needed)

module.exports = async function (context, req) {
    try {
        const flickrApiKey = process.env.HUGO_FLICKR_API_KEY;

        if (!flickrApiKey || flickrApiKey.trim() === "") {
            context.res = {
                status: 500,
                body: { error: "Flickr API key is missing or invalid" },
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            return;
        }

        if (!req.query.method) {
            context.res = {
                status: 400,
                body: { error: "Missing Flickr API method parameter" },
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            return;
        }

        // Build the Flickr API URL
        const flickrEndpoint = "https://api.flickr.com/services/rest/";
        const params = new URLSearchParams(req.query);
        params.append("api_key", flickrApiKey);
        params.append("format", "json");
        params.append("nojsoncallback", "1");

        // Generate cache key
        const cacheKey = params.toString();
        const now = Date.now();

        // Check if response is cached and still valid
        if (cache.has(cacheKey)) {
            const cachedEntry = cache.get(cacheKey);
            if (now - cachedEntry.timestamp < CACHE_TTL) {
                context.res = {
                    status: 200,
                    body: cachedEntry.data,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "X-Cache": "HIT"
                    }
                };
                return;
            }
        }

        // Fetch fresh data from Flickr API
        const flickrResponse = await fetch(`${flickrEndpoint}?${cacheKey}`);
        const data = await flickrResponse.json();

        // Store response in cache
        cache.set(cacheKey, { data, timestamp: now });

        context.res = {
            status: flickrResponse.status,
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "X-Cache": "MISS"
            }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: `Error fetching from Flickr: ${error.message}` },
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        };
    }
};