import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const endpoint = "https://shrey-mefljixz-eastus2.cognitiveservices.azure.com/openai/deployments/ad-editor/chat/completions?api-version=2025-01-01-preview";

app.post("/api/edit-ad", async (req, res) => {
  try {
    const { ad } = req.body;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_API_KEY, // 🔒 Key stays safe in Vercel
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are Lifeinvader’s Ad Editor. Apply Lifeinvader Policy strictly. Always return:\n<Corrected Ad>.\nCategory: <Correct Category>",
          },
          { role: "user", content: ad },
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    const data = await response.json();

    const content = data.choices[0].message.content;
    const [editedAd, categoryLine] = content.split("Category:");

    res.json({
      editedAd: editedAd.trim(),
      category: categoryLine ? categoryLine.trim() : "Uncategorized",
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Server running"));
