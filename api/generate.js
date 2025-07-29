import fetch from "node-fetch";

export default async function handler(req, res) {
  const { industry } = req.query;

  if (!industry) {
    return res.status(400).json({ error: "Industry is required" });
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 startup ideas for ${industry} industry.
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
    const ideas =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") ||
      "No ideas generated.";

    res.status(200).json({ ideas });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
