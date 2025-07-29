import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load env

// Debug API Key
const API_KEY = process.env.GEMINI_API_KEY;
console.log("🔑 API Key Loaded:", API_KEY ? "Yes" : "No");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

app.get("/api/generate", async (req, res) => {
  const industry = req.query.industry;
  if (!industry) {
    return res.status(400).json({ error: "Industry is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate 5 startup ideas for the ${industry} industry. 
                  Each idea should include:
                  1. Short name
                  2. One-line description
                  3. Revenue model`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("🔍 API Raw Response:", JSON.stringify(data, null, 2));

    const ideas =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") ||
      "No ideas generated.";

    res.json({ ideas });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
