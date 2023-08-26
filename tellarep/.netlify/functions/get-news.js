const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  let endpoint = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

  // If there's a query parameter, switch to the "everything" endpoint
  if (event.queryStringParameters && event.queryStringParameters.query) {
    const searchQuery = event.queryStringParameters.query;
    endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      searchQuery
    )}&apiKey=${apiKey}`;
  }

  const response = await fetch(endpoint);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
