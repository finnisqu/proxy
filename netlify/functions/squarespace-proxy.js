// netlify/functions/squarespace-proxy.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event, context) => {
  try {
    const { imageUrl, mode } = event.queryStringParameters || {};

    // ✅ Step 1: Debug to prove function runs
    if (!imageUrl && !mode) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "✅ Proxy function is running!",
          params: event.queryStringParameters,
          timestamp: new Date().toISOString()
        })
      };
    }

    // ✅ Step 2: JSON passthrough (fetch Squarespace data)
    if (mode === "json") {
      const response = await fetch("https://www.worldstoneonline.com/?format=json");
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }

    // ✅ Step 3: Image passthrough
    if (imageUrl) {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "image/png";

      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400" // 24h cache
        },
        body: Buffer.from(buffer).toString("base64"),
        isBase64Encoded: true
      };
    }

    // Default response if nothing matched
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required parameters" })
    };

  } catch (err) {
    console.error("❌ Proxy Error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message, stack: err.stack })
    };
  }
};
