// netlify/functions/squarespace-proxy.js

import fetch from "node-fetch";

export async function handler(event) {
  const { queryStringParameters } = event;

  try {
    // 1. JSON REQUEST
    if (queryStringParameters.format === "json") {
      const sqsUrl =
        "https://worldstoneonline.squarespace.com/?format=json-pretty"; // change if needed

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

    // 2. IMAGE REQUEST
    if (queryStringParameters.imageUrl) {
      const imageUrl = queryStringParameters.imageUrl;

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

    // 3. Fallback
    return {
      statusCode: 400,
      body: "Missing query params. Use ?format=json or ?imageUrl=...",
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: "Proxy error: " + err.message };
  }
}
