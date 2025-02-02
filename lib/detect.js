// @ts-check
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { frameworks } from "../lib/meta.js"
import * as y from "yoctocolors"

/**
 * When this function runs in a framework directory we support,
 * it will return the framework's name
 * @param {string} path
 * @returns {Promise<import("./meta").SupportedFramework | "unknown" | "multiple-frameworks-detected">}
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
      console.log("Multiple supported frameworks detected.")
      return "multiple-frameworks-detected"
    }
    return "unknown"
  } catch (error) {
    console.error("An error occurred while detecting the framework.")
    console.error(error)
    process.exit(0)
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
