// @ts-check

import * as y from "yoctocolors"
import open from "open"
import clipboard from "clipboardy"
import { select, input, password } from "@inquirer/prompts"
import { requireFramework } from "../lib/detect.js"
import { updateEnvFile } from "../lib/write-env.js"
import { providers, frameworks } from "../lib/meta.js"
import { secret } from "./index.js"
import { link, markdownToAnsi } from "../lib/markdown.js"

const choices = Object.entries(providers)
  .filter(([, { setupUrl }]) => !!setupUrl)
  .map(([value, { name }]) => ({ name, value }))

/** @param {string | undefined} providerId */
export async function action(providerId) {
  try {
    if (!providerId) {
      providerId = await select({
        message: "What provider do you want to set up?",
        choices: choices,
      })
    }

    const provider = providers[providerId]
    if (!provider?.setupUrl) {
      console.error(
        y.red(
          `Missing instructions for ${
            provider?.name ?? providerId
          }.\nInstructions are available for: ${y.bold(
            choices.map((choice) => choice.name).join(", ")
          )}`
        )
      )
      return
    }

    const frameworkId = await requireFramework()
    const framework = frameworks[frameworkId]

    console.log(
      y.dim(
        `Setting up OAuth provider in your ${framework.name} app (${link(
          "more info",
          "https://authjs.dev/getting-started/authentication/oauth"
        )})...\n`
      )
    )

    const url = new URL(
      `${framework.path}/callback/${providerId}`,
      `http://localhost:${framework.port}`
    )

    clipboard.writeSync(url.toString())
    console.log(
      `\
${y.bold("Setup URL")}: ${provider.setupUrl}
${y.bold("Callback URL (copied to clipboard)")}: ${url}`
    )

    console.log("_________________________")
    if (provider.instructions) {
      console.log(y.dim("\nFollow the instructions:\n"))
      console.log(markdownToAnsi(provider.instructions))
    }
    console.log(
      y.dim(
        `\nProvider documentation: https://providers.authjs.dev/${providerId}\n`
      )
    )
    console.log("‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾")
    console.log(y.dim("Opening setup URL in your browser...\n"))
    await new Promise((resolve) => setTimeout(resolve, 3000))

    await open(provider.setupUrl)

    const clientId = await input({
      message: `Paste ${y.magenta("Client ID")}:`,
      validate: (value) => !!value,
    })
    const clientSecret = await password({
      message: `Paste ${y.magenta("Client secret")}:`,
      mask: true,
      validate: (value) => !!value,
    })

    console.log(y.dim(`Updating environment variable file...`))

    const varPrefix = `AUTH_${providerId.toUpperCase()}`

    await updateEnvFile({
      [`${varPrefix}_ID`]: clientId,
      [`${varPrefix}_SECRET`]: clientSecret,
    })

    console.log(
      y.dim(
        `\nEnsuring that ${link(
          "AUTH_SECRET",
          "https://authjs.dev/getting-started/installation#setup-environment"
        )} is set...`
      )
    )

    await secret.action({})

    console.log("\n🎉 Done! You can now use this provider in your app.")
  } catch (error) {
    if (!(error instanceof Error)) return
    if (error.message.startsWith("User force closed")) return
    throw error
  }
}
