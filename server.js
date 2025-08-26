// server.js

// Load environment variables
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // Make sure node-fetch@2 is installed

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static("public"));
app.use(bodyParser.json()); // parse JSON body

// Root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/muskan-bot.html");
});

// Chat API route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("User message:", userMessage);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();
    console.log("API response:", data);

    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a reply.";

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    res.status(500).json({ reply: "❌ Error: Server/API connection failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});