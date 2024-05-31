// @ts-check
import { execSync } from "node:child_process"
import { input, confirm } from "@inquirer/prompts"
import * as y from "yoctocolors"
import { action as secretAction } from "./secret.js"

import { detectFramework } from "../lib/detect.js"
import { install } from "../lib/pkg-manager.js"

// TODO: Get this programmatically
export const frameworks = {
  next: {
    name: "Next.js",
    src: "https://github.com/nextauthjs/next-auth-example",
    demo: "https://next-auth-example.vercel.app",
  },
  sveltekit: {
    name: "SvelteKit",
    src: "https://github.com/nextauthjs/sveltekit-auth-example",
    demo: "https://sveltekit-auth-example.vercel.app",
  },
  express: {
    name: "Express",
    src: "https://github.com/nextauthjs/express-auth-example",
    demo: "https://express-auth-example.vercel.app",
  },
}

export async function action(framework) {
  framework ??= await detectFramework()
  if (framework === "unknown") {
    return console.log(`
Supported frameworks are:

 • ${Object.entries(frameworks)
   .map(([key, val]) => `${val.name} ${y.gray(`(${key})`)}`)
   .join("\n • ")}`)
  }
  const { src, demo } = frameworks[framework]

  try {
    const dir = await input({
      message: "Name of the project",
      default: `my-${framework}-app`,
    })

    const generateSecret = await confirm({
      message: "Initiailze .env with `AUTH_SECRET`",
      default: true,
    })

    await cloneGitRepo(src, dir)

    if (generateSecret) {
      execSync(`cd ${dir}`)
      await secretAction({ write: true, path: dir })
    }

    await install()

    console.log(`
Project ${y.italic(`\`${dir}\``)} has been created.
Source code: ${src}
Deployed demo: ${demo}`)
  } catch (e) {
    if (!(e instanceof Error)) return
    if (e.message.startsWith("User force closed")) return

    console.error(y.red(e.message))
  }
}

/**
 * @param {string} url
 * @param {string} dir
 */
async function cloneGitRepo(url, dir = "") {
  execSync(`git clone ${url} ${dir}`)
}
