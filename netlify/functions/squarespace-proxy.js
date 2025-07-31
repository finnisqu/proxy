import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event, context) {
  try {
    // ✅ Allow category to be passed as a query parameter
    // Example: /api/squarespace-proxy?url=https://yoursite.squarespace.com/gallery&category=Granite
    const queryParams = event.queryStringParameters;
    const targetUrl = queryParams.url;
    const category = queryParams.category || "Uncategorized";

    if (!targetUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'url' query parameter" })
      };
    }

    // ✅ Fetch Squarespace gallery HTML
    const res = await fetch(targetUrl);
    const html = await res.text();

    // ✅ Parse with Cheerio
    const $ = cheerio.load(html);
    const products = [];

    $(".sqs-gallery .slide img").each((_, el) => {
      const name = $(el).attr("alt")?.replace(".jpg", "").trim();
      const image = $(el).attr("data-src");

      if (name && image) {
        products.push({
          name,
          image,
          category
        });
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // allow frontend to fetch
      },
      body: JSON.stringify({ products })
    };

  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
}
