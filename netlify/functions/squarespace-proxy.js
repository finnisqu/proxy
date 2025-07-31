// netlify/functions/squarespace-proxy.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const response = await fetch("https://worldstoneonline.squarespace.com/api/commerce/products");
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",   // allow all domains
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(data),
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
