// @ts-check
import { readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * @typedef {"nextjs" | "express" | "sveltekit"} SupportedFramework
 */

/**
 * When this function runs in a framework directory we support,
 * it will return the framework's name
 * @returns {Promise<SupportedFramework | "unknown">}
 */
export async function detectFramework() {
  const dir = process.cwd()
  const packageJsonPath = join(dir, "package.json")
  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"))

    /** @type {SupportedFramework[]} */
    const foundFrameworks = []

    if (packageJson.dependencies["next"]) foundFrameworks.push("nextjs")
    if (packageJson.dependencies["express"]) foundFrameworks.push("express")
    if (packageJson.devDependencies["@sveltejs/kit"])
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
    return "unknown"
  }
}
