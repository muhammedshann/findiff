import { GoogleGenerativeAI } from "@google/generative-ai";

import { buildPrompt } from "../prompts.js";

export async function generateWithGemini(
    diff,
    config
) {
    const genAI = new GoogleGenerativeAI(
        config.apiKey
    );

    const model = genAI.getGenerativeModel({
        model: config.model,
    });

    const result = await model.generateContent(
        buildPrompt(diff)
    );

    return result.response.text().trim();
}