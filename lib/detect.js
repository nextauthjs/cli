// @ts-check
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { frameworks } from "../lib/meta.js"
import * as y from "yoctocolors"

/**
 * When this function runs in a framework directory we support,
 * it will return the framework's name
 * @param {string} path
 * @returns {Promise<import("./meta").SupportedFramework | "unknown">}
 */
export async function detectFramework(path = "") {
  const dir = process.cwd()
  const packageJsonPath = join(dir, path, "package.json")
  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"))

    /** @type {import("./meta").SupportedFramework[]} */
    const foundFrameworks = []

    if (packageJson?.dependencies?.["next"]) foundFrameworks.push("next")
    if (packageJson?.dependencies?.["express"]) foundFrameworks.push("express")
    if (packageJson?.devDependencies?.["@sveltejs/kit"])
      foundFrameworks.push("sveltekit")

    if (foundFrameworks.length === 1) return foundFrameworks[0]

    if (foundFrameworks.length > 1) {
      console.error(
        `Multiple supported frameworks detected: ${foundFrameworks.join(", ")}`
      )
      return "unknown"
    }
    return "unknown"
  } catch (error) {
    console.error(error)
    return "unknown"
  }
}

export async function requireFramework(path = "") {
  const framework = await detectFramework(path)

  if (framework === "unknown") {
    console.error(
      y.red(
        `No framework detected. Currently supported frameworks are: ${y.bold(
          Object.keys(frameworks).join(", ")
        )}`
      )
    )

    process.exit(0)
  }

  return framework
}
