import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = "sk-xxxxxxxxxxxxxxxx";

app.post("/generate", async (req, res) => {
  const { message, tone } = req.body;

  const prompt = `
Generate 3 short replies to this message:
"${message}"

Tone: ${tone}

Rules:
- natural texting style
- lowercase
- short replies
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    const replies = text.split("\n").filter(r => r.trim() !== "");

    res.json({ replies });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log("Server running"));
