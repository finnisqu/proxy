// netlify/functions/squarespace-proxy.js
export async function handler(event, context) {
  try {
    // Always get full product feed, not category‑filtered
    const feedUrl = `https://www.worldstoneonline.com/products-1?format=json`;

    const response = await fetch(feedUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy failed", details: err.message })
    };
  }
}
