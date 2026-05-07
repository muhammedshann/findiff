#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";

import { getGitDiff } from "./git.js";
import { loadConfig, saveConfig } from "./config.js";
import { generateCommitMessage } from "./ai.js";

const command = process.argv[2];

if (command === "config") {
    const existingConfig = await loadConfig();

    if (existingConfig) {
        console.log(chalk.yellow("Existing NVIDIA API key found.\n"));

        const answer = await inquirer.prompt([
            {
                type: "confirm",
                name: "changeKey",
                message: "Do you want to replace the current API key?",
                default: false,
            },
        ]);

        if (!answer.changeKey) {
            console.log(chalk.cyan("Keeping existing API key."));
            process.exit(0);
        }
    }

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "apiKey",
            message: "Enter NVIDIA API Key",
        },
    ]);

    await saveConfig(answers);

    console.log(chalk.green("\nNVIDIA API key saved successfully."));
    process.exit(0);
}

const config = await loadConfig();

if (!config) {
    console.log(chalk.red("No configuration found."));
    console.log(chalk.yellow("Run: smartcommit config"));
    process.exit(1);
}

const diff = await getGitDiff();

if (!diff.trim()) {
    console.log(chalk.yellow("No staged changes found."));
    process.exit(0);
}

const spinner = ora("Generating commit message ...").start();

try {
    const message = await generateCommitMessage(
        diff,
        config.apiKey
    );

    spinner.stop();

    console.log("");
    console.log(chalk.green("Suggested Commit Message:"));
    console.log(chalk.cyan(message));
    console.log("");

    const answer = await inquirer.prompt([
        {
            type: "confirm",
            name: "commit",
            message: "Commit with this message?",
            default: true,
        },
    ]);

    if (answer.commit) {
        const { execSync } = await import("child_process");

        execSync(`git commit -m "${message}"`, {
            stdio: "inherit",
        });
    }
} catch (error) {
    spinner.stop();

    console.error(chalk.red("Error generating commit message"));
    console.error(error.message);
}