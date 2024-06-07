import path from 'node:path'
import * as y from "yoctocolors"
import open from 'open'
import { select, confirm } from '@inquirer/prompts'
import { requireFramework } from "../lib/detect.js"
import { write as writeClipboard } from "../lib/clipboard/index.js"
import { providers, frameworks } from "../lib/meta.js"

const instructions = {
  google: {
    setupUrl: 'https://console.cloud.google.com/apis/credentials/oauthclient'
  },
  github: {
    setupUrl: 'https://github.com/settings/applications/new'
  },
  apple: {
    setupUrl: 'https://developer.apple.com/account/resources/identifiers/list/serviceId'
  }
}

function hasInstructions(provider) {
  return Object.keys(providers).includes(provider)
}

async function chooseProvider() {
  const choices = Object.keys(instructions).map((value) => {
    const name = providers[value]

    return { name, value }
  })

  return await select({
    message: "What provider do you want to set up?",
    choices
  })
}

export async function action(provider) {
  if (!provider) {
    provider = await chooseProvider()
  }

  if (!hasInstructions(provider)) {
    console.error(y.red(`Missing instructions for ${provider}.\nInstructions are available for: ${y.bold(Object.keys(instructions).sort().join(', '))}`))
    process.exit(0)
  }

  const frameworkId = await requireFramework()
  const framework = frameworks[frameworkId]
  const providerName = providers[provider]
  const baseUrl =  path.join(`http://localhost:${framework.port}`, framework.path)
  const callbackUrl = path.join(baseUrl, `callbacks/${provider}`)
  const { setupUrl } = instructions[provider]

  console.log(`  ${y.bold('Setup')}: ${setupUrl}\n  ${y.bold('App')}: ${baseUrl}\n  ${y.bold('Callback')}: ${callbackUrl}`)

  const openBrowser = await confirm({ message: `Open ${y.magenta(providerName)} setup page?`})
  if (openBrowser) await open(setupUrl)

  const copy = await confirm({ message: `Copy callback URL? ${y.magenta(callbackUrl)}`})
  if (copy) writeClipboard(callbackUrl)

  console.log({ provider, framework, baseUrl, callbackUrl, setupUrl })
}
