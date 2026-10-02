require("dotenv").config();
const { askGemini } = require("./services/gemini");

askGemini(
  "Say hello in one short sentence for a career app called CareerCompass.",
)
  .then(console.log)
  .catch((e) => console.log("Error:", e.message));
