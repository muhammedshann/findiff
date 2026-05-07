import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

const IGNORED_FOLDERS = [
  "node_modules",
  "dist",
  "build",
  ".next",
  ".cache",
  "coverage",
];

export async function getGitDiff() {
  try {
    // Get staged file list
    const stagedFiles = execSync(
      "git diff --cached --name-only",
      {
        encoding: "utf-8",
      }
    )
      .split("\n")
      .filter(Boolean);

    // Detect unwanted folders
    const detectedFolders = [];

    for (const folder of IGNORED_FOLDERS) {
      const exists = stagedFiles.some((file) =>
        file.startsWith(folder + "/")
      );

      if (exists) {
        detectedFolders.push(folder);
      }
    }

    let excludeFolders = [];

    // Ask user if unnecessary folders detected
    if (detectedFolders.length > 0) {
      console.log("");
      console.log(
        chalk.yellow(
          "Large/unnecessary folders detected:"
        )
      );

      detectedFolders.forEach((folder) => {
        console.log(chalk.cyan(`- ${folder}`));
      });

      console.log("");

      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "include",
          message:
            "Do you want to include these folders in AI analysis?",
          default: false,
        },
      ]);

      if (!answer.include) {
        excludeFolders = detectedFolders;
      }
    }

    // Build exclude arguments
    const excludeArgs = excludeFolders
      .map(
        (folder) => `':(exclude)${folder}'`
      )
      .join(" ");

    // Build final git diff command
    const command = excludeArgs
      ? `git diff --cached -- . ${excludeArgs}`
      : "git diff --cached";

    const diff = execSync(command, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    return diff;
  } catch (error) {
    console.error(
      chalk.red("Failed to read git diff")
    );

    console.error(error.message);

    process.exit(1);
  }
}