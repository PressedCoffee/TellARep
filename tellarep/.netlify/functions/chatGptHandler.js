const OpenAI = require("openai").default;

require("dotenv").config(); // to access environment variables

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});

exports.handler = async function (event, context) {
  const promptData = JSON.parse(event.body);
  const prompt = promptData.prompt;

  // Construct the chat messages
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: prompt },
  ];

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 325,
    });

    console.log("OpenAI Response:", chatCompletion);

    const message = chatCompletion.choices[0].message.content.trim();
    console.log("Extracted Message:", message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: message }),
    };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message || "Failed to fetch from OpenAI API",
        }),
      };
    } else {
      // Non-API error
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Unknown error occurred.",
        }),
      };
    }
  }
};

/*
exports.handler = async function (event, context) {
  // Ensure we only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Extract the prompt from the request body
  const requestBody = JSON.parse(event.body);
  const prompt = requestBody.prompt;

  try {
    const response = await openai.complete({
      engine: "davinci",
      prompt: prompt,
      max_tokens: 150, // You can adjust this value as needed
    });

    const message =
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].text.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: message }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from OpenAI API" }),
    };
  }
};
*/
