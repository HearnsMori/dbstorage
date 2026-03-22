const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_B,
  process.env.GEMINI_API_KEY_C,
  process.env.GEMINI_API_KEY_D,
  process.env.GEMINI_API_KEY_E,
  process.env.GEMINI_API_KEY_F,
  process.env.GEMINI_API_KEY_G,
  process.env.GEMINI_API_KEY_H,
  process.env.GEMINI_API_KEY_I,
  process.env.GEMINI_API_KEY_J,
].filter(Boolean); // remove undefined keys

async function generalbot(message, context) {
  let remainingKeys = [...API_KEYS];

  while (remainingKeys.length > 0) {
    // pick random index
    const randomIndex = Math.floor(Math.random() * remainingKeys.length);
    const selectedKey = remainingKeys[randomIndex];

    try {
      const genAI = new GoogleGenerativeAI(selectedKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: context,
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const text = await response.text();

      return text;

    } catch (err) {
      console.error(`Error with key:`, err.message);

      // remove the failed key so it won't be reused
      remainingKeys.splice(randomIndex, 1);

      if (remainingKeys.length === 0) {
        return "Generative AI Error: All API keys exhausted.";
      }

      console.log("Retrying with another random key...");
    }
  }
}

exports.aiTXTGenerator = async (req, res) => {
  try {
    const { message, context } = req.body;
    const botresponse = await generalbot(message, context);
    res.status(201).json({ message: botresponse });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
