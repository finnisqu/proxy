const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { imageUrl, mode } = event.queryStringParameters || {};

  try {
    if (mode === "json") {
      // Squarespace product feed
      const url = "https://worldstoneonline.com/?format=json";
      const res = await fetch(url);
      const data = await res.json();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    }

    if (imageUrl) {
      // Proxy an image
      const res = await fetch(imageUrl);
      const buffer = await res.arrayBuffer();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/png",
          "Access-Control-Allow-Origin": "*",
        },
        body: Buffer.from(buffer).toString("base64"),
        isBase64Encoded: true,
      };
    }

    return {
      statusCode: 400,
      body: "Missing parameters: provide ?mode=json or ?imageUrl=",
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: "Internal proxy error" };
  }
};
