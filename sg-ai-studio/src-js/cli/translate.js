#!/usr/bin/env node

import path from "path";
import fs from "fs";
import process from "process";
import i18nCalypso from "i18n-calypso-cli";
import { fileURLToPath } from "url";

const file = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file);

const projectRoot = path.dirname(__dirname);
const packageJsonPath = path.join(projectRoot, "package.json");
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error("Error reading package.json:", error.message);
  process.exit(1);
}

const walkRecursive = (directory, ext, match) => {
  try {
    const files = fs.readdirSync(directory);

    for (let filename of files) {
      const filepath = path.join(directory, filename);

      try {
        if (fs.statSync(filepath).isDirectory()) {
          walkRecursive(filepath, ext, match);
        } else if (ext.includes(path.extname(filename))) {
          match.push(filepath);
        }
      } catch (error) {
        console.warn(`Warning: Could not access ${filepath}: ${error.message}`);
      }
    }
  } catch (error) {
    console.warn(
      `Warning: Could not read directory ${directory}: ${error.message}`
    );
  }

  return match;
};

const walk = (directory, ext = []) => {
  return walkRecursive(directory, ext, []);
};

const srcPath = path.join(projectRoot, "src");
if (!fs.existsSync(srcPath)) {
  console.error("Error: src directory not found");
  process.exit(1);
}

const files = walk(srcPath, [".js", ".jsx", ".ts", ".tsx"]);

if (files.length === 0) {
  console.warn("Warning: No source files found to process");
  process.exit(0);
}

console.log(`Found ${files.length} files to process for translation`);

const distPath = path.join(projectRoot, "dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

const outputPath = path.join(projectRoot, "dist/react-strings.php");
const projectName = packageJson.name.replace("@siteground/", "");

try {
  i18nCalypso({
    format: "PHP",
    inputPaths: files,
    output: outputPath,
    projectName: projectName,
  });
} catch (error) {
  console.error("Error generating translation file:", error.message);
  process.exit(1);
}
