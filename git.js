import { execSync } from "child_process";

export function getGitDiff() {
  try {
    const diff = execSync("git diff --cached", {
      encoding: "utf-8",
    });

    return diff;
  } catch (error) {
    console.error("Failed to read git diff");
    process.exit(1);
  }
}