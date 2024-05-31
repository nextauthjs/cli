// @ts-check

import { yellow } from "yoctocolors"
import { spawn } from "node:child_process"
import { getOnline } from "./is-online.js"

/**
 * @typedef {'npm' | 'pnpm' | 'yarn' | 'bun'} PackageManager
 */

/**
 * @source https://github.com/vercel/next.js/blob/canary/packages/create-next-app/helpers/get-pkg-manager.ts
 * @returns {PackageManager}
 */
export function getPkgManager() {
  const userAgent = process.env.npm_config_user_agent || ""

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  if (userAgent.startsWith("bun")) {
    return "bun"
  }

  if (userAgent.startsWith("yarn")) {
    return "yarn"
  }

  return "npm"
}

/**
 * @source https://github.com/vercel/next.js/blob/canary/packages/create-next-app/helpers/install.ts
 * Spawn a package manager installation based on user preference.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export async function install() {
  const packageManager = getPkgManager()
  /** @type {string[]} */
  const args = ["install"]
  if (!(await getOnline())) {
    console.log(
      yellow("You appear to be offline.\nFalling back to the local cache.")
    )
    args.push("--offline")
  }
  return new Promise((resolve, reject) => {
    /** Spawn the installation process. */
    const child = spawn(packageManager, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: "development",
        DISABLE_OPENCOLLECTIVE: "1",
      },
    })
    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${packageManager} ${args.join(" ")}` })
        return
      }
      resolve(void 0)
    })
  })
}
