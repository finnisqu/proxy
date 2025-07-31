// netlify/functions/squarespace-proxy.js
export async function handler(event, context) {
  try {
    const category = event.queryStringParameters.category || "Granite";

    // Squarespace JSON feed URL
    const feedUrl = `https://www.worldstoneonline.com/products-1?category=${encodeURIComponent(category)}&format=json`;

    const response = await fetch(feedUrl);
    const data = await response.json();

    // Return JSON with proper CORS headers
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
