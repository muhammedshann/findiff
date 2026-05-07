import { generateWithNvidia } from "./nvidia.js";
import { generateWithGemini } from "./gemini.js";
import { generateWithOpenAI } from "./openai.js";
import { generateWithOpenRouter } from "./openrouter.js";

export async function generateCommitMessage(
    diff,
    config
) {
    switch (config.provider) {
        case "nvidia":
            return generateWithNvidia(diff, config);

        case "gemini":
            return generateWithGemini(diff, config);

        case "openai":
            return generateWithOpenAI(diff, config);
        case "openrouter":
            return generateWithOpenRouter(diff, config);

        default:
            throw new Error(
                `Unsupported provider: ${config.provider}`
            );
    }
}