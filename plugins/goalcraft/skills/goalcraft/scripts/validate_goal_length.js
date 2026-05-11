#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

const DEFAULT_MAX_CHARS = 4000;
const TARGET_CHARS = 2800;

function objectiveText(input) {
  let text = input.trim();
  if (text.startsWith("```")) {
    let lines = text.split(/\r?\n/);
    if (lines.length > 0 && lines[0].startsWith("```")) {
      lines = lines.slice(1);
    }
    if (lines.length > 0 && lines[lines.length - 1].startsWith("```")) {
      lines = lines.slice(0, -1);
    }
    text = lines.join("\n").trim();
  }
  if (text.startsWith("/goal")) {
    const rest = text.slice("/goal".length);
    if (/^[ \n\t]/.test(rest)) {
      return rest.trim();
    }
  }
  return text;
}

function usage() {
  console.log(`Validate that a Codex /goal objective fits the TUI objective limit.

Usage: validate_goal_length.js [path] [--max-chars N] [--target-chars N] [--strict-target]

Arguments:
  path              File containing the /goal command or objective. Reads stdin when omitted.

Options:
  --max-chars N     Hard maximum objective characters. Default: ${DEFAULT_MAX_CHARS}.
  --target-chars N  Recommended target objective characters. Default: ${TARGET_CHARS}.
  --strict-target   Exit non-zero when objective characters exceed --target-chars.
  -h, --help        Show this help.`);
}

function parseArgs(argv) {
  const args = {
    path: null,
    maxChars: DEFAULT_MAX_CHARS,
    targetChars: TARGET_CHARS,
    strictTarget: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      usage();
      process.exit(0);
    }
    if (arg === "--strict-target") {
      args.strictTarget = true;
      continue;
    }
    if (arg === "--max-chars" || arg === "--target-chars") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a numeric value`);
      }
      const parsed = Number.parseInt(value, 10);
      if (!Number.isInteger(parsed) || parsed < 1) {
        throw new Error(`${arg} must be a positive integer`);
      }
      if (arg === "--max-chars") {
        args.maxChars = parsed;
      } else {
        args.targetChars = parsed;
      }
      i += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`unknown option: ${arg}`);
    }
    if (args.path) {
      throw new Error(`unexpected extra argument: ${arg}`);
    }
    args.path = arg;
  }

  return args;
}

function readInput(path) {
  if (path) {
    return fs.readFileSync(path, "utf8");
  }
  return fs.readFileSync(0, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const objective = objectiveText(readInput(args.path));
  const count = Array.from(objective).length;

  console.log(`objective_chars=${count}`);
  console.log(`target_chars=${args.targetChars}`);
  console.log(`max_chars=${args.maxChars}`);

  if (count > args.maxChars) {
    console.error("error=objective exceeds Codex /goal character limit");
    return 1;
  }
  if (count > args.targetChars) {
    console.error("warning=objective passes hard limit but exceeds target");
    if (args.strictTarget) {
      return 1;
    }
  }
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`error=${error.message}`);
  process.exitCode = 2;
}
