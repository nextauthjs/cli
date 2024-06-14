// @ts-check
import { execSync } from "node:child_process"
import { input, confirm, select, checkbox } from "@inquirer/prompts"
import * as y from "yoctocolors"
import { action as secretAction } from "./secret.js"

import { getPkgManager, install } from "../lib/pkg-manager.js"
import * as meta from "../lib/meta.js"
import { updateEnvFile } from "../lib/write-env.js"
import { mkdir } from "node:fs/promises"

/**
 * @param {string} framework
 * @param {{example?: boolean}} options
 * @returns
 */
export async function action(framework, options) {
  try {
    if (!framework) {
      framework = await select({
        message: "Select a framework",
        choices: Object.entries(meta.frameworks).map(([key, value]) => ({
          name: `${value.name} ${y.dim(`(${key})`)}`,
          value: key,
        })),
      })
    }

    const dir = await input({
      message: "Name of the project",
      default: `my-${framework}-app`,
    })

    if (options.example) await createFromExample(framework, dir)

    const providers = await checkbox({
      instructions: false,
      message: "Select one or multiple providers",
      choices: Object.entries(meta.providers).map(([value, { name }]) => ({
        name,
        value,
      })),
    })

    /** @type {string|undefined} */
    let adapter = await select({
      default: "none",
      message: "Select a database adapter",
      choices: Object.entries(meta.adapters).map(([value, name]) => ({
        name,
        value,
      })),
    })
    adapter = adapter === "none" ? undefined : adapter

    await scaffoldProject({ framework, dir, providers, adapter })
  } catch (e) {
    if (!(e instanceof Error)) return
    if (e.message.startsWith("User force closed")) return

    console.error(y.red(e.message))
  }
}

/**
 * @param {string} framework
 * @param {string} dir
 */
async function createFromExample(framework, dir) {
  const { src, demo } = meta.frameworks[framework]
  execSync(`git clone ${src} ${dir}`)
  if (
    await confirm({
      message: "Initiailze .env with `AUTH_SECRET`",
      default: true,
    })
  ) {
    execSync(`cd ${dir}`)
    await secretAction({ path: dir })
  }

  await install()

  console.log(`
  Project ${y.italic(`\`${dir}\``)} has been created.
  Source code: ${src}
  Deployed demo: ${demo}`)
}

/**
 * @param {{framework: string, dir: string, providers: string[], adapter?: string}} options
 */
async function scaffoldProject(options) {
  const { framework, providers, dir, adapter } = options
  const pkgManager = getPkgManager()
  console.log(
    `Scaffolding ${y.bold(framework)} project with ${y.bold(
      pkgManager
    )} at ${y.bold(dir)}...`
  )
  throw new Error("Scaffolding not implemented. Please use `init --example`")
  console.log(`Create directory ${dir}`)
  await mkdir(dir)
  console.log(`Change directory to ${dir}`)
  execSync(`cd ${dir}`)
  console.log(`Initialize ${pkgManager} project`)
  execSync(`${pkgManager} init`)
  // console.log(`Add ${framework} to ${pkgManager}`)
  // execSync(`${pkgManager} install ${framework}`)
  for (const provider of providers) {
    const id = `AUTH_${provider.toUpperCase()}_ID`
    const secret = `AUTH_${provider.toUpperCase()}_SECRET`
    await updateEnvFile(
      {
        [id]: "",
        [secret]: "",
      },
      dir
    )
  }
}
