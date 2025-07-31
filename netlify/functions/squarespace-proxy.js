// netlify/functions/squarespace-proxy.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { mode, imageUrl } = event.queryStringParameters || {};

    // ✅ 1. If "mode=json" → fetch Squarespace JSON feed
    if (mode === "json") {
      const sqsUrl = "https://www.worldstoneonline.com/?format=json"; // replace with your Squarespace site JSON feed
      const res = await fetch(sqsUrl);
      const data = await res.json();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    // ✅ 2. If "imageUrl" → proxy the image
    if (imageUrl) {
      const res = await fetch(imageUrl);
      const buffer = await res.arrayBuffer();

      return {
        statusCode: 200,
        headers: { "Content-Type": res.headers.get("content-type") || "image/png" },
        body: Buffer.from(buffer).toString("base64"),
        isBase64Encoded: true,
      };
    }

    // ✅ 3. Default response (heartbeat)
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "✅ Proxy function is running!",
        params: event.queryStringParameters,
        timestamp: new Date().toISOString(),
      }),
    };

  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
