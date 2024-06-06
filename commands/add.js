import * as y from "yoctocolors"
import { select } from '@inquirer/prompts'
import { requireFramework } from "../lib/detect.js"

const providers = {
  google: {
    name: "Google"
  },
  github: {
    name: "GitHub"
  },
  apple: {
    name: "Apple"
  }
}

function hasInstructions(provider) {
  return Object.keys(providers).includes(provider)
}

async function chooseProvider() {
  const choices = Object.keys(providers).map((key) => {
    const provider = providers[key]

    return {
      name: provider.name,
      value: key
    }
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
    console.error(y.red(`Missing instructions for ${provider}.\nAvailable providers are: ${y.bold(Object.keys(providers).sort().join(', '))}`))
    process.exit(0)
  }

  const framework = await requireFramework()

  console.log({ provider, framework })
}
