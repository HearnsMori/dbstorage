const { GoogleGenerativeAI } = require("@google/generative-ai");

function extractJsonFromString(msgText) {
    // Extract from first { to last } as before
    const firstBrace = msgText.indexOf('{');
    const lastBrace = msgText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return { msg: msgText }; // fallback
    }

    let jsonStr = msgText.substring(firstBrace, lastBrace + 1);

    // Replace single quotes with double quotes
    jsonStr = jsonStr.replace(/'/g, '"');

    try {
        return JSON.parse(jsonStr);
    } catch (err) {
        console.warn("Failed to parse AI JSON:", err.message);
        return { msg: msgText }; // fallback
    }
}

async function generalbot(genAI, msg, expectedJSONOutput) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Add a prompt context that guides the bot to respond as a learning assistant
        const learningContextPrompt = "You are a generative agent AI chatbot."
            + "\nYour message should be in this format only, don't add any more: \n"
            + expectedJSONOutput
            + "\nRespond only with the required format.";
        // Combine the learning context with the user’s prompt
        const fullPrompt = `${learningContextPrompt} \nUser (message): ${msg}`;

        // Generate content based on the combined prompt
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Return the generated text as the bot's response
        return text;
    } catch (err) {
        console.error("Gemini API error:", err);
        return "Generative AI Error"; // Fallback error message
    }
}

exports.aiJSONGenerator = async (req, res) => {
    try {
        const { msg, expectedJSONOutput } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const botresponse = await generalbot(genAI, msg, expectedJSONOutput);
        const parsed = extractJsonFromString(botresponse);
        res.json(parsed);
    } catch (error) {
        console.error("Error handling /process/jsonGenerator request:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}