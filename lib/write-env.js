// @ts-check

import * as y from "yoctocolors"
import { readFile, writeFile } from "node:fs/promises"
import prompt from "prompts"
import { join } from "node:path"
import { frameworks } from "./meta.js"
import { detectFramework } from "./detect.js"

/**
 * Update a key-value pair to a .env file
 * @param {string|undefined} envPath
 * @param {string} key
 * @param {string} value
 */
export async function updateEnvFile(envPath = "", key, value) {
  const framework = await detectFramework(envPath)
  const dotEnvFile = frameworks[framework]?.envFile
  let content = ""
  const line = `${key}="${value}" # Added by \`npx auth\`. Read more: https://cli.authjs.dev`
  const file = join(process.cwd(), envPath, dotEnvFile)
  try {
    content = await readFile(file, "utf-8")
    if (!content.includes(`${key}=`)) {
      console.log(`➕ Added ${key} to ${y.italic(file)}.`)
      content = `${line}\n${content}`
    } else {
      const { overwrite } = await prompt({
        type: "confirm",
        name: "overwrite",
        message: `Overwrite existing ${key}?`,
        initial: false,
      })
      if (!overwrite) return
      console.log(`✨ Updated ${key} in ${y.italic(file)}.`)
      content = content.replace(new RegExp(`${key}=(.*)`), `${line}`)
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`📝 Created ${y.italic(file)} with ${key}.`)
      content = line
    } else {
      throw error
    }
  }
  if (content) await writeFile(file, content)
}
