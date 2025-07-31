const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { queryStringParameters } = event;

    // 🔹 Mode 1: Proxy an image request
    if (queryStringParameters.imageUrl) {
      const imageUrl = queryStringParameters.imageUrl;

      const response = await fetch(imageUrl);
      if (!response.ok) {
        return { statusCode: response.status, body: "Image fetch failed" };
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "image/jpeg";

      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400"
        },
        body: Buffer.from(arrayBuffer).toString("base64"),
        isBase64Encoded: true
      };
    }

    // 🔹 Mode 2: Squarespace JSON feed
    const feedUrl = "https://www.worldstoneonline.com/store?format=json-pretty";
    const res = await fetch(feedUrl);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
