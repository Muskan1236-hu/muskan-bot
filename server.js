import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static(".")); // static files serve karega (muskan-bot.html)

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mujhe samajh nahi aaya 😅";

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error ho gaya 😔" });
  }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000/muskan-bot.html"));