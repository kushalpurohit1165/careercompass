const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(body) {
  const model = process.env.GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  let lastError = "Gemini request failed";

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return (
        data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || ""
      );
    }

    lastError = data.error?.message || "Gemini request failed";
    const retryable = [429, 500, 503].includes(res.status);
    if (!retryable || attempt === 3) break;
    await sleep(2000 * attempt);
  }

  throw new Error(lastError);
}

async function askGemini(prompt, { json = false } = {}) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (json) body.generationConfig = { responseMimeType: "application/json" };
  return callGemini(body);
}

async function chatGemini(systemText, messages) {
  return callGemini({
    systemInstruction: { parts: [{ text: systemText }] },
    contents: messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  });
}

module.exports = { askGemini, chatGemini };
