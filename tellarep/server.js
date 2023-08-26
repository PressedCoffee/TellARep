const express = require("express");
const bodyParser = require("body-parser");
const chatGptHandler = require("./.netlify/functions/chatGptHandler.js");
require("dotenv").config();
const apiKey = process.env.REACT_APP_OPEN_AI_API_KEY;

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post("/chatGptHandler", async (req, res) => {
  const result = await chatGptHandler.handler({
    body: JSON.stringify(req.body),
  });
  res.status(result.statusCode).send(result.body);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
