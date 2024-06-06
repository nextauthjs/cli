import * as y from "yoctocolors"
import { select } from '@inquirer/prompts'
import { requireFramework } from "../lib/detect.js"
import { providers, frameworks } from "../lib/meta.js"

const instructions = {
  google: {
  },
  github: {
  },
  apple: {
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

  const framework = await requireFramework()

  console.log({ provider, framework })
}
