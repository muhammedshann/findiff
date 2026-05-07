# Findiff

### AI-powered git commit message generator for developers.

Generate clean, professional, and meaningful commit messages directly from your staged Git changes using modern AI models.

`Findiff` helps developers maintain high quality Git history without wasting time writing commit messages manually.

---

## Features

-  AI powered commit message generation
-  Conventional Commits support
-  Multi provider AI support
-  Fast terminal workflow
-  Smart large folder detection
-  Interactive commit confirmation
-  Automatic model selection
-  Local API key storage
-  Works with any Git repository

---

## Supported AI Providers

| Provider | Default Model |
|---|---|
| Gemini | `gemini-2.5-flash` |
| NVIDIA | `meta/llama-3.1-8b-instruct` |
| OpenAI | `gpt-4.1-mini` |
| OpenRouter | `deepseek/deepseek-chat-v3-0324:free` |

---

## Installation

Install globally using npm:

```bash
npm install -g findiff
```

---

## Configuration

Before first use, configure your preferred AI provider:

```bash
findiff config
```

You will be prompted to:

1. Select AI provider
2. Enter API key

Your configuration is stored locally on your machine:

---

## Usage

### 1. Stage your changes

```bash
git add .
```

### 2. Generate commit message

```bash
findiff
```

---

## Example

### Input

```bash
git add .
findiff
```

### Output

```bash
Suggested Commit Message:
feat(auth): implement Google OAuth login flow
```

---

## Smart Diff Detection

`Findiff` automatically detects large or unnecessary folders such as:

- `node_modules`
- `dist`
- `build`
- `.next`
- `.cache`

and allows you to exclude them from AI analysis for:
- faster performance
- reduced token usage
- cleaner commit messages

---

## Privacy & Security

- Only staged Git changes are analyzed
- API keys are stored locally
- No hidden background tracking
- No repository uploads

---

## Requirements

- Node.js 18+
- Git installed

---

## Developer

Developed by **Muhammed Shan**

GitHub:
https://github.com/muhammedshann

Portfolio:
https://muhammedshan.online

---

Built with ❤️ for developers who care about clean Git history.