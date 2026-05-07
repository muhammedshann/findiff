import fs from "fs-extra";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(
  os.homedir(),
  ".findiff"
);

const CONFIG_FILE = path.join(
  CONFIG_DIR,
  "config.json"
);

export async function saveConfig(data) {
  await fs.ensureDir(CONFIG_DIR);

  await fs.writeJson(CONFIG_FILE, data, {
    spaces: 2,
  });
}

export async function loadConfig() {
  const exists = await fs.pathExists(
    CONFIG_FILE
  );

  if (!exists) {
    return null;
  }

  return await fs.readJson(CONFIG_FILE);
}