exports.handler = async function (event, context) {
  console.log("🟢 squarespace-proxy function invoked!");
  console.log("🔹 Query params:", event.queryStringParameters);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "✅ Proxy function is running!",
      params: event.queryStringParameters || {},
      timestamp: new Date().toISOString(),
    }),
  };
};
