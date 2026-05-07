#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";

import { getGitDiff } from "./git.js";

import {
    loadConfig,
    saveConfig,
} from "./config.js";

import {
    generateCommitMessage,
} from "./providers/index.js";

const command = process.argv[2];

if (command === "config") {
    const existingConfig =
        await loadConfig();

    if (existingConfig) {
        console.log("");

        console.log(
            chalk.cyan(
                "Current Configuration:"
            )
        );

        console.log(
            chalk.yellow(
                `Provider: ${existingConfig.provider}`
            )
        );

        console.log(
            chalk.yellow(
                `Model: ${existingConfig.model}`
            )
        );

        console.log("");
    }

    const answers =
        await inquirer.prompt([
            {
                type: "list",
                name: "provider",
                message:
                    "Select AI provider",

                choices: [
                    "nvidia",
                    "gemini",
                    "openrouter",
                    "openai",
                ],

                default:
                    existingConfig?.provider,
            },

            {
                type: "input",
                name: "apiKey",
                message: "Enter API key",

                default:
                    existingConfig?.apiKey,
                validate: (input) => {
                    if (!input.trim()) {
                        return "API key is required";
                    }

                    return true;
                },
            },
        ]);

    const DEFAULT_MODELS = {
        nvidia:
            "meta/llama-3.1-8b-instruct",

        gemini:
            "gemini-2.5-flash",

        openai:
            "gpt-4.1-mini",

        openrouter:
            "deepseek/deepseek-chat-v3-0324:free",
    };

    answers.model =
        DEFAULT_MODELS[
        answers.provider
        ];

    await saveConfig(answers);

    console.log("");

    console.log(
        chalk.green(
            "Configuration updated successfully."
        )
    );

    console.log(
        chalk.cyan(
            `Provider: ${answers.provider}`
        )
    );

    console.log(
        chalk.cyan(
            `Model: ${answers.model}`
        )
    );

    console.log("");

    process.exit(0);
}

const config = await loadConfig();

if (!config) {
    console.log(
        chalk.red("No configuration found.")
    );

    console.log(
        chalk.yellow(
            "Run: findiff config"
        )
    );

    process.exit(1);
}

const diff = await getGitDiff();

if (!diff.trim()) {
    console.log(
        chalk.yellow(
            "No staged changes found."
        )
    );

    process.exit(0);
}

const spinner = ora(
    "Generating commit message..."
).start();

try {
    const message =
        await generateCommitMessage(
            diff,
            config
        );

    spinner.stop();

    console.log("");

    console.log(
        chalk.green(
            "Suggested Commit Message:"
        )
    );

    console.log(chalk.cyan(message));

    console.log("");

    const answer =
        await inquirer.prompt([
            {
                type: "confirm",
                name: "commit",
                message:
                    "Commit with this message?",
                default: true,
            },
        ]);

    if (answer.commit) {
        const { execSync } =
            await import("child_process");

        execSync(
            `git commit -m "${message}"`,
            {
                stdio: "inherit",
            }
        );
    }
} catch (error) {
    spinner.stop();

    console.error(
        chalk.red(
            "Error generating commit message"
        )
    );

    console.error(error.message);
}