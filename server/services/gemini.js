async function askGemini(prompt) {
  const model = process.env.GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return (
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || ""
  );
}

module.exports = { askGemini };
