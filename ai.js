import OpenAI from "openai";

export async function generateCommitMessage(diff, apiKey) {
    const client = new OpenAI({
        apiKey,
        baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const completion = await client.chat.completions.create({
        model: "meta/llama-3.1-70b-instruct",

        messages: [
            {
                role: "system",
                content:
                    "You generate clean professional git commit messages.",
            },
            {
                role: "user",
                content: `
You are an expert software engineer.

Generate a high-quality professional git commit message.

Requirements:
- Use conventional commits format
- Be descriptive but concise
- Mention the main feature or change
- Mention important secondary changes if relevant
- Sound like an experienced developer wrote it
- Max 1 sentence
- No quotes
- Return ONLY the commit message

Good examples:
feat(blog): add blog page and update navbar links
fix(auth): resolve token refresh issue on login
refactor(api): simplify user validation middleware
feat(ui): implement responsive dashboard sidebar

Git Diff:
${diff}
`,
            },
        ],

        temperature: 0.2,
        max_tokens: 60,
    });

    return completion.choices[0].message.content.trim();
}