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
        console.log(
            chalk.yellow(
                "Existing configuration found.\n"
            )
        );

        const answer =
            await inquirer.prompt([
                {
                    type: "confirm",
                    name: "changeConfig",
                    message:
                        "Do you want to replace the current configuration?",
                    default: false,
                },
            ]);

        if (!answer.changeConfig) {
            console.log(
                chalk.cyan(
                    "Keeping existing configuration."
                )
            );

            process.exit(0);
        }
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
            },

            {
                type: "input",
                name: "apiKey",
                message: "Enter API key",
            },

        ]);
    const DEFAULT_MODELS = {
        nvidia: "meta/llama-3.1-8b-instruct",

        gemini: "gemini-2.5-flash",

        openrouter: "deepseek/deepseek-chat-v3-0324:free",

        openai: "gpt-4.1-mini",
    };

    answers.model =
        DEFAULT_MODELS[answers.provider];

    await saveConfig(answers);

    console.log(
        chalk.green(
            "\nConfiguration saved successfully."
        )
    );

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