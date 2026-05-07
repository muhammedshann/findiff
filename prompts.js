export function buildPrompt(diff) {
    return `
You are an expert software engineer.

Generate a high-quality professional git commit message.

Requirements:
- Use conventional commits format
- Be descriptive but concise
- Mention important changes
- Max 1 sentence
- No quotes
- Return ONLY the commit message

Examples:
feat(auth): add Google login support
fix(api): resolve token refresh issue
refactor(ui): simplify sidebar component

Git Diff:
${diff}
`;
}