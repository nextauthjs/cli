// @ts-check

import { InvalidArgumentError } from "commander"
import { Command } from "commander"
import { frameworks, action as frameworkAction } from "./commands/framework.js"
import { action as secretAction } from "./commands/secret.js"
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
  .command("framework")
  .argument("[framework]", "The framework to use.", (value) => {
    if (!value) return value
    if (Object.keys(frameworks).includes(value)) return value
    throw new InvalidArgumentError(
      `Valid frameworks are: ${frameworks.join(", ")}`
    )
  })
  .description("Clone a framework template.")
  .action(frameworkAction)

program
  .command("secret")
  .option("--raw", "Output the string without any formatting.")
  .option("--copy", 'Copy AUTH_SECRET="value"')
  .description("Generate a random string.")
  .action(secretAction)

program.parse()

export { program }
