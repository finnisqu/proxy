export async function handler(event, context) {
  try {
    const imageUrl = event.queryStringParameters.imageUrl;
    if (!imageUrl) {
      return {
        statusCode: 400,
        body: "Missing imageUrl parameter",
      };
    }

    // Fetch the image from Squarespace (or wherever)
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Netlify Proxy",
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch image: ${response.statusText}`,
      };
    }

    // Get content type from origin (important for images)
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // Convert response into ArrayBuffer for binary passthrough
    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",  // Allow all origins
        "Cache-Control": "public, max-age=3600",
      },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true, // 🔑 Tells Netlify this is binary
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Proxy error: ${err.message}`,
    };
  }
}
