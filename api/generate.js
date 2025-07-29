import fetch from "node-fetch";

export default async function handler(req, res) {
  const { industry } = req.query;

  if (!industry) {
    return res.status(400).json({ error: "Industry is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 startup ideas for ${industry}. Each idea should have a short name, one-line description, and revenue model.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.length > 0) {
      res.status(200).json({ ideas: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "No ideas found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
