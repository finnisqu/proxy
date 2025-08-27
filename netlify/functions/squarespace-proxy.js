// netlify/functions/squarespace-proxy.js
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  try {
    // Fetch Squarespace product JSON feed
    const response = await fetch("https://www.worldstoneonline.com/products-1?format=json");

    if (!response.ok) {
      throw new Error(`Squarespace feed returned ${response.status}`);
    }

    const data = await response.json();

    // Confirm whether products are in data.items
    const items = data.items || [];

    // Map out simplified product structure
    const products = items.map(item => ({
      id: item.id,
      title: item.title,
      url: `https://www.worldstoneonline.com${item.fullUrl}`,
      image: item.assetUrl,
      categories: item.categories || [],
      tags: item.tags || []
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(products, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
    "Pragma": "no-cache",
    "Expires": "0"
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
