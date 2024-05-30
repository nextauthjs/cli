#!/usr/bin/env node

// @ts-check

import { InvalidArgumentError } from "commander"
import { Command } from "commander"
import { ask, framework, secret } from "./commands/index.js"

// import pkg from "./package.json" assert { type: "json" }

import fs from "fs/promises"
import { join } from "path"
import { fileURLToPath } from "url"
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

program.name(name).description(description).version(version)

program
  .command("ask")
  .option("--stream", "Stream the response.")
  .option("--raw", "Shows the Markdown response without formatting.")
  .description("Ask any question about docs, API, etc.")
  .action(ask.action)

program
  .command("framework")
  .argument("[framework]", "The framework to use.", (value) => {
    if (Object.keys(framework.frameworks).includes(value)) return value
    throw new InvalidArgumentError(
      `Valid frameworks are: ${framework.frameworks.join(", ")}`
    )
  })
  .description("Clone a framework template.")
  .action(framework.action)

program
  .command("secret")
  .option("--raw", "Output the string without any formatting.")
  .option("--copy", 'Copy AUTH_SECRET="value"')
  .option("--write", 'Write AUTH_SECRET="value" to the .env file.')
  .description("Generate a random string.")
  .action(secret.action)

program.parse()

export { program }
