import OpenAI from "openai";

import { buildPrompt } from "../prompts.js";

export async function generateWithNvidia(
    diff,
    config
) {
    const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL:
            "https://integrate.api.nvidia.com/v1",
    });

    const completion =
        await client.chat.completions.create({
            model: config.model,

            messages: [
                {
                    role: "user",
                    content: buildPrompt(diff),
                },
            ],

            temperature: 0.2,
            max_tokens: 60,
        });

    return completion.choices[0].message.content.trim();
}