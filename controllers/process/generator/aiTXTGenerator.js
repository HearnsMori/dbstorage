const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generalbot(genAI, msg) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
       
        const result = await model.generateContent(msg);
        const response = await result.response;
        const text = response.text();

        // Return the generated text as the bot's response
        return text;
    } catch (err) {
        console.error("Gemini API error:", err);
        return "Generative AI Error"; // Fallback error message
    }
}

exports.aiTXTGenerator = async (req, res) => {
    try {
        const { msg } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const botresponse = await generalbot(genAI, msg);
        res.status(201).json({msg: botresponse});
    } catch (error) {
        console.error("Error handling /process/aiTXTGenerator request:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}
