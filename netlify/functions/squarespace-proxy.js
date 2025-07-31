// netlify/functions/squarespace-proxy.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const params = event.queryStringParameters || {};
    const format = params.format ? params.format.toLowerCase() : null;
    const imageUrl = params.imageUrl;

    console.log("DEBUG params:", params);

    // ✅ Force JSON branch first
    if (format === "json") {
      const sqsUrl = "https://worldstoneonline.squarespace.com/?format=json-pretty";

      const response = await fetch(sqsUrl);
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: `Squarespace JSON request failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    // ✅ Only run if JSON not requested
    if (imageUrl) {
      const response = await fetch(imageUrl, {
        headers: { "User-Agent": "Netlify Proxy" },
      });

      if (!response.ok) {
        return {
          statusCode: response.status,
          body: `Image request failed: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get("content-type") || "image/png";
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
        body: buffer.toString("base64"),
        isBase64Encoded: true,
      };
    }

    // Fallback
    return {
      statusCode: 400,
      body: "Missing query params. Use ?format=json or ?imageUrl=...",
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: "Proxy error: " + err.message };
  }
}
