// @ts-check

import * as y from "yoctocolors"
import { readFile, writeFile } from "node:fs/promises"
import prompt from "prompts"
import { join } from "node:path"
import { frameworks } from "./meta.js"
import { detectFramework } from "./detect.js"

/**
 * Add/update key-value pair(s) to a .env file
 * @param {Record<string, string>} env
 * @param {string|undefined} envPath
 * @param {boolean} comment
 */
export async function updateEnvFile(env, envPath = "", comment = true) {
  const framework = await detectFramework(envPath)
  const dotEnvFile = frameworks[framework]?.envFile
  const file = join(process.cwd(), envPath, dotEnvFile)
  let content = ""
  let read = false
  let created = false
  for (const [key, value] of Object.entries(env)) {
    const line = `${key}="${value}"${
      comment ? " # Added by `npx auth`. Read more: https://cli.authjs.dev" : ""
    }`
    try {
      if (!read) {
        content = await readFile(file, "utf-8")
        read = true
      }
      if (!content.includes(`${key}=`)) {
        console.log(`➕ Added \`${key}\` to ${y.italic(file)}.`)
        content = content ? `${content}\n${line}` : line
      } else {
        const { overwrite } = await prompt({
          type: "confirm",
          name: "overwrite",
          message: `Overwrite existing \`${key}\`?`,
          initial: false,
        })
        if (!overwrite) continue
        console.log(`✨ Updated \`${key}\` in ${y.italic(file)}.`)
        content = content.replace(new RegExp(`${key}=(.*)`), `${line}`)
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        if (!created) {
          console.log(`📝 Created ${y.italic(file)} with \`${key}\`.`)
          created = true
        } else {
          console.log(`➕ Added \`${key}\` to ${y.italic(file)}.`)
        }
        content = content ? `${content}\n${line}` : line
      } else {
        throw error
      }
    }
  }
  if (content) await writeFile(file, content)
}
