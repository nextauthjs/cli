#!/usr/bin/env node

// @ts-check

import { Command, InvalidArgumentError } from "commander"
import * as y from "yoctocolors"
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

program
  .name(name)
  .description(description.replace("Auth.js", y.magenta(y.bold("Auth.js"))))
  .version(version)

program
  .command("ask")
  .option("--stream", "stream the response")
  .option("--raw", "show the Markdown response without formatting")
  .description("ask about docs, API, or auth concepts")
  .action(ask.action)

program
  .command("framework")
  .argument("[framework]", "The framework to use.", (value) => {
    if (Object.keys(framework.frameworks).includes(value)) return value
    throw new InvalidArgumentError(
      `Valid frameworks are: ${framework.frameworks.join(", ")}`
    )
  })
  .description("clone a framework template")
  .action(framework.action)

program
  .command("secret")
  .option("--raw", "Output the string without any formatting.")
  .option("--copy", 'Copy AUTH_SECRET="value"')
  .option("--write", 'Write AUTH_SECRET="value" to the .env file.')
  .description("generate a random string")
  .action(secret.action)

program.parse()

export { program }
