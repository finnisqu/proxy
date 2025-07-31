const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters || {};
    const imageUrl = params.imageUrl;
    const format = params.format;

    // If JSON requested
    if (format === "json") {
      const res = await fetch("https://worldstoneonline.squarespace.com/products?format=json");
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

    // If an image URL was provided
    if (imageUrl) {
      const res = await fetch(imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/png",
          "Access-Control-Allow-Origin": "*",
        },
        body: buffer.toString("base64"),
        isBase64Encoded: true,
      };
    }

    // Default if neither parameter is passed
    return {
      statusCode: 400,
      body: "Missing parameters: use ?format=json or ?imageUrl=<url>",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Proxy error: " + err.message,
    };
  }
};
