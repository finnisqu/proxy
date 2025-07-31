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
    // Use Squarespace public JSON feed instead of /api/commerce
    const response = await fetch("https://www.worldstoneonline.com/products-1?format=json");

    if (!response.ok) {
      throw new Error(`Squarespace feed returned ${response.status}`);
    }

    const data = await response.json();

    // Extract just products (simplify payload)
    const products = data.items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.fullUrl,
      image: item.assetUrl,
      categories: item.categories,
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
