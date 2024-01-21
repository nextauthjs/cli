import { InvalidArgumentError } from "commander"
import { Command } from "commander"
import { frameworks, action as frameworkAction } from "./commands/framework.js"
import { action as secretAction } from "./commands/secret.js"
import chalk from "chalk"
// import pkg from "./package.json" assert { type: "json" }

import fs from "fs/promises"
import { join } from "path"
import { fileURLToPath } from "url"
const __dirname = fileURLToPath(new URL(".", import.meta.url))
const pkg = JSON.parse(await fs.readFile(join(__dirname, "./package.json")))
const { name, description, version } = pkg

try {
  // TODO: Remove when Node.js 18 is not maintained anymore
  globalThis.crypto ??= (await import("crypto")).webcrypto
} catch {}

const program = new Command()

const timeLabel = "command duration"

program
  .name(name)
  .description(description)
  .version(version)
  .option("--trace", "display trace statements for commands")
  .option("--profile", "show how long a command takes")
  .hook("preAction", (thisCommand, actionCommand) => {
    if (thisCommand.opts().trace) {
      console.log(
        `About to call action handler for subcommand: ${actionCommand.name()}`
      )
      console.log(chalk.bold.green("Arguments:"), actionCommand.args)
      console.log(chalk.bold.green("Options:"), actionCommand.opts())
    }
    if (thisCommand.opts().profile) {
      console.time(timeLabel)
    }
  })
  .hook("postAction", (thisCommand) => {
    if (thisCommand.opts().profile) {
      console.timeEnd(timeLabel)
    }
  })

program
  .command("framework")
  .argument("[framework]", "The framework to use.", (value) => {
    if (!value) return value
    if (Object.keys(frameworks).includes(value)) return value
    throw new InvalidArgumentError(
      `Valid frameworks are: ${supportedFrameworks.join(", ")}`
    )
  })
  .description("Clone a framework template.")
  .action(frameworkAction)

program
  .command("secret")
  .option("--raw", "Output the string without any formatting.")
  .description("Generate a random string.")
  .action(secretAction)

program.parse(process.argv)

export { program }
