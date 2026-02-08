const { GoogleGenerativeAI } = require("@google/generative-ai");

// List of API keys in order
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_B,
  process.env.GEMINI_API_KEY_C,
  process.env.GEMINI_API_KEY_D,
  process.env.GEMINI_API_KEY_E

];

async function generalbot(msg) {
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS[i]);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(msg);
      const response = await result.response;
      const text = await response.text();

      // If successful, return the response
      return text;
    } catch (err) {
      console.error(`Gemini API error with key ${i + 1}:`, err.message);

      // If last key, throw error
      if (i === API_KEYS.length - 1) {
        return "Generative AI Error: All API keys exhausted.";
      }

      // Otherwise, try next key
      console.log("Trying next API key...");
    }
  }
}

exports.aiTXTGenerator = async (req, res) => {
  try {
    const { msg } = req.body;
    const botresponse = await generalbot(msg);
    res.status(201).json({ msg: botresponse });
  } catch (error) {
    console.error("Error handling /process/aiTXTGenerator request:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
