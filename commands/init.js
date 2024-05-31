// @ts-check
import { execSync } from "node:child_process"
import { input, confirm, select, checkbox } from "@inquirer/prompts"
import * as y from "yoctocolors"
import { action as secretAction } from "./secret.js"

import { install } from "../lib/pkg-manager.js"
import * as meta from "../lib/meta.js"

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
      choices: Object.entries(meta.providers).map(([value, name]) => ({
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
    await secretAction({ write: true, path: dir })
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
  console.log(options)
  throw new Error("Not implemented")
}
