const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// 🟢 Ye line add karo - static files serve karne ke liye
app.use(express.static(path.join(__dirname)));

// API route (Gemini se baat karne ke liye)
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, samajh nahi paya 😅";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Server error ⚠️" });
  }
});

// 🟢 Agar koi direct root URL hit kare to index page bhej do
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "muskan-bot.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});