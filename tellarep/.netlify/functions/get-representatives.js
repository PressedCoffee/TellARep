const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const zipCode = JSON.parse(event.body).zipCode;
  console.log("Received zip code:", zipCode);

  const API_KEY = process.env.REACT_APP_GOOGLE_CIVIC_API_KEY;

  // Here is the correct endpoint definition
  const endpoint = `https://www.googleapis.com/civicinfo/v2/representatives?key=${API_KEY}&address=${zipCode}`;

  try {
    const response = await fetch(endpoint); // Make sure to use 'endpoint' here
    const data = await response.json();
    console.log("Full response from Google Civic API:", data);

    if (!data || data.error) {
      console.error("Error from Google Civic API:", data.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch representative info" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching representative info:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
