export default async function handler(req, res) {
  const { industry } = req.query;

  if (!industry || industry.trim() === "") {
    return res.status(400).json({ error: "Industry is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 startup ideas for the ${industry} industry. 
                  Each idea should have:
                  - A short creative name
                  - One-line description
                  - Revenue model`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    res
      .status(200)
      .json({
        ideas:
          data.candidates[0]?.content?.parts[0]?.text ||
          "No ideas generated. Try another industry."
      });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
