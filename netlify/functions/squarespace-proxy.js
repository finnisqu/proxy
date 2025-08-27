// netlify/functions/squarespace-proxy.js
export async function handler(event) {
  try {
    // Allow either a full URL on your domain or a relative path
    const { url: rawUrl, path } = event.queryStringParameters || {};
    const TARGET_HOST = process.env.SQSP_HOST || 'https://worldstoneonline.com'; // <- change or set in Netlify env

    const incoming = rawUrl || path; // support both ?url=/products-1?format=json and ?path=/products-1?format=json
    if (!incoming) {
      return {
        statusCode: 400,
               body: JSON.stringify({ error: "Provide ?url=/... or ?path=/..." }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // If it's a full URL, ensure it’s on your domain; otherwise treat as relative
    let target;
    try {
      const u = new URL(incoming, TARGET_HOST);
      if (!u.href.startsWith(TARGET_HOST)) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid host" }) };
      }
      target = u.href;
    } catch {
      // Shouldn't happen, but bail if URL can't be built
      return { statusCode: 400, body: JSON.stringify({ error: "Bad URL" }) };
    }

    const res = await fetch(target, {
      headers: {
        // Some Squarespace endpoints require a UA
        'User-Agent': 'Mozilla/5.0 (Netlify-Proxy)',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json') || target.includes('format=json');
    const text = await res.text();

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': isJson ? 'application/json' : 'text/plain',
        'Cache-Control': 'public, max-age=300' // 5 min
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || String(err) }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}
