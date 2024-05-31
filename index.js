#!/usr/bin/env node

// @ts-check

import { Command, InvalidArgumentError } from "commander"
import * as y from "yoctocolors"
import { ask, init, secret } from "./commands/index.js"

// import pkg from "./package.json" assert { type: "json" }

import fs from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const pkg = JSON.parse(
  await fs.readFile(join(__dirname, "./package.json"), "utf-8")
)
const { name, description, version } = pkg

try {
  // TODO: Remove when Node.js 18 is not maintained anymore
  // @ts-expect-error
  globalThis.crypto ??= (await import("crypto")).webcrypto
} catch {}

const program = new Command()

program
  .name(name)
  .description(description.replace("Auth.js", y.magenta(y.bold("Auth.js"))))
  .version(version)

program
  .command("ask")
  .option("--stream", "Stream the response.")
  .option("--raw", "Show the Markdown response without formatting.")
  .description("Ask about docs, API, or auth concepts.")
  .action(ask.action)

program
  .command("init")
  .argument("[framework]", "The framework to use.")
  .option("-e, --example", "Clone a full example.")
  .description("Initialize a project.")
  .action(init.action)

program
  .command("secret")
  .option("--raw", "Output the string without any formatting.")
  .option("--copy", 'Copy AUTH_SECRET="value".')
  .option("--write", 'Write AUTH_SECRET="value" to the .env file.')
  .description("Generate a random string.")
  .action(secret.action)

program.parse()

export { program }
