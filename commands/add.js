// @ts-check

import * as y from "yoctocolors"
import open from "open"
import clipboard from "clipboardy"
import { select, input, password, number } from "@inquirer/prompts"
import { requireFramework } from "../lib/detect.js"
import { updateEnvFile } from "../lib/write-env.js"
import { providers, frameworks } from "../lib/meta.js"
import { link, markdownToAnsi } from "../lib/markdown.js"
import { appleGenSecret } from "../lib/apple-gen-secret.js"

/**
 * @param {string} label
 * @param {string} [defaultValue]
 */
async function promptInput(label, defaultValue) {
  return input({
    message: `Paste ${y.magenta(label)}:`,
    validate: (value) => !!value,
    default: defaultValue,
  })
}

/** @param {string} label */
async function promptPassword(label) {
  return password({
    message: `Paste ${y.magenta(label)}:`,
    mask: true,
    validate: (value) => !!value,
  })
}

const choices = Object.entries(providers)
  .filter(([, { setupUrl }]) => !!setupUrl)
  .map(([value, { name }]) => ({ name, value }))

/** @param {string | undefined} providerId */
export async function action(providerId) {
  try {
    providerId ??= await select({
      message: "What provider do you want to set up?",
      choices: choices,
    })

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

    if (providerId === "apple") {
      const clientId = await promptInput("Client ID")
      const keyId = await promptInput("Key ID")
      const teamId = await promptInput("Team ID")
      const privateKey = await input({
        message: "Path to Private Key",
        validate: (value) => !!value,
        default: "./private-key.p8",
      })

      const expiresInDays =
        (await number({
          message: "Expires in days (default: 180)",
          required: false,
          default: 180,
        })) ?? 180

      console.log(y.dim("Updating environment variable file..."))

      await updateEnvFile({ AUTH_APPLE_ID: clientId })

      const secret = await appleGenSecret({
        teamId,
        clientId,
        keyId,
        privateKey,
        expiresInDays,
      })

      await updateEnvFile({ AUTH_APPLE_SECRET: secret })
    } else {
      const clientId = await promptInput("Client ID")
      const clientSecret = await promptPassword("Client Secret")

      console.log(y.dim("Updating environment variable file..."))

      const varPrefix = `AUTH_${providerId.toUpperCase()}`
      await updateEnvFile({
        [`${varPrefix}_ID`]: clientId,
        [`${varPrefix}_SECRET`]: clientSecret,
      })
    }

    console.log("\n🎉 Done! You can now use this provider in your app.")
  } catch (error) {
    if (!(error instanceof Error)) return
    if (error.message.startsWith("User force closed")) return
    throw error
  }
}
