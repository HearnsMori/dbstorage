const { GoogleGenerativeAI } = require("@google/generative-ai");

function extractJsonFromString(msgText) {
    console.log("AI Response Text:", msgText);
    // Extract from first { to last } as before
    const firstBrace = msgText.indexOf('{');
    const lastBrace = msgText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return { msg: msgText }; // fallback
    }

    let jsonStr = msgText.substring(firstBrace, lastBrace + 1);

    console.log("Extracted JSON String:", jsonStr);

    
    jsonStr = jsonStr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#039;");
    

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
            + "\nRespond only with the required format."
            + "\nDon't use \" inside key or value and make sure the JSON is properly formatted and can be parse without an error.";
        // Combine the learning context with the user’s prompt
        console.log(expectedJSONOutput);
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
        res.status(201).json(parsed);
    } catch (error) {
        console.error("Error handling /process/aiJSONGenerator request:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}
