import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Keep the original generate-message route for backward compatibility
router.post("/generate-message", async (req, res) => {
    try {
        const { rules } = req.body;

        const prompt = `
You're a marketing assistant. Based on the customer rules below, write a short, engaging and unique campaign message under 200 characters. Use unique and attractive keywords everytime.
Use {{name}} for personalization.

${rules.map((r, i) => `${i + 1}. ${r.field} ${r.operator} ${r.value}`).join("\n")}
`;

        const model = genAI.getGenerativeModel({
            model: "models/gemini-1.5-flash",
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        res.json({ message: text });
    } catch (err) {
        console.error("🧨 Gemini error:", err.response?.data || err.message || err);
        res.status(500).json({ error: "AI message generation failed" });
    }
});

// New route for getting multiple suggestions
router.post("/get-suggestions", async (req, res) => {
    try {
        const { rules } = req.body;

        const prompt = `
You're a marketing assistant. Based on the customer rules below, write 3 different short, engaging and unique campaign messages under 200 characters each. Each message should be different in tone and approach.
Use {{name}} for personalization.

Rules:
${rules.map((r, i) => `${i + 1}. ${r.field} ${r.operator} ${r.value}`).join("\n")}

Requirements:
- Generate exactly 3 different messages
- Each message should be under 200 characters
- Use different tones: professional, friendly, and urgent
- Include {{name}} for personalization
- Separate each message with "---"
- Make each message unique and engaging
`;

        const model = genAI.getGenerativeModel({
            model: "models/gemini-1.5-flash",
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Split the response by "---" and clean up each suggestion
        const suggestions = text
            .split("---")
            .map(msg => msg.trim())
            .filter(msg => msg.length > 0)
            .slice(0, 3); // Ensure we only get 3 suggestions

        // If we don't get 3 suggestions, generate them individually
        if (suggestions.length < 3) {
            const fallbackSuggestions = [];
            const tones = ["professional", "friendly", "urgent"];

            for (let i = 0; i < 3; i++) {
                const tone = tones[i];
                const individualPrompt = `
You're a marketing assistant. Based on the customer rules below, write one short, engaging campaign message under 200 characters with a ${tone} tone.
Use {{name}} for personalization.

Rules:
${rules.map((r, i) => `${i + 1}. ${r.field} ${r.operator} ${r.value}`).join("\n")}
`;

                try {
                    const individualResult = await model.generateContent(individualPrompt);
                    const individualText = individualResult.response.text().trim();
                    fallbackSuggestions.push(individualText);
                } catch (error) {
                    console.error(`Error generating ${tone} suggestion:`, error);
                    fallbackSuggestions.push(`Hi {{name}}, special offer just for you!`);
                }
            }

            res.json({ suggestions: fallbackSuggestions });
        } else {
            res.json({ suggestions });
        }

    } catch (err) {
        console.error("🧨 Gemini error:", err.response?.data || err.message || err);

        // Fallback suggestions if AI fails
        const fallbackSuggestions = [
            "Hi {{name}}, don't miss out on this exclusive offer!",
            "{{name}}, your special discount is waiting for you!",
            "Limited time offer for you, {{name}}! Act now!"
        ];

        res.json({ suggestions: fallbackSuggestions });
    }
});

export default router;