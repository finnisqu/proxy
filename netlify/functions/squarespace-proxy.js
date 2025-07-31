// netlify/functions/squarespace-proxy.js
exports.handler = async function(event, context) {
  console.log("DEBUG params:", event.queryStringParameters);

  const { imageUrl, format } = event.queryStringParameters || {};

  try {
    // If we're proxying an image
    if (imageUrl) {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return { statusCode: response.status, body: "Failed to fetch image" };
      }

      const contentType = response.headers.get("content-type") || "image/png";
      const arrayBuffer = await response.arrayBuffer();

      return {
        statusCode: 200,
        headers: { "Content-Type": contentType },
        body: Buffer.from(arrayBuffer).toString("base64"),
        isBase64Encoded: true
      };
    }

    // If we're fetching Squarespace JSON
    if (format === "json") {
      const response = await fetch("https://www.worldstoneonline.com/?format=json");
      if (!response.ok) {
        return { statusCode: response.status, body: "Failed to fetch JSON" };
      }
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }

    // Default response if no params
    return {
      statusCode: 400,
      body: "Missing parameters. Use ?imageUrl=... or ?format=json"
    };

  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: "Internal server error" };
  }
};
