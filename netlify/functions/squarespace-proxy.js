import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { imageUrl, mode } = event.queryStringParameters || {};

    // 1) IMAGE MODE
    if (imageUrl) {
      const r = await fetch(imageUrl);
      const contentType = r.headers.get("content-type") || "image/png";
      const buffer = await r.arrayBuffer();

      return {
        statusCode: 200,
        headers: { "Content-Type": contentType },
        body: Buffer.from(buffer).toString("base64"),
        isBase64Encoded: true,
      };
    }

    // 2) JSON MODE (fetch Squarespace products)
    if (mode === "json") {
      const res = await fetch("https://www.worldstoneonline.com/products?format=json");
      const data = await res.json();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    // 3) DEFAULT
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
