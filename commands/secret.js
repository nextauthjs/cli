// @ts-check

import * as y from "yoctocolors"
import { write } from "../lib/clipboard/index.js"
import { detectFramework } from "../lib/detect.js"
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import prompt from "prompts"

/** Web compatible method to create a random string of a given length */
function randomString(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  // @ts-expect-error
  return Buffer.from(bytes, "base64").toString("base64")
}

/** @type {Record<import("../lib/detect.js").SupportedFramework, string>} */
export const frameworkDotEnvFile = {
  nextjs: ".env.local",
  express: ".env",
  sveltekit: ".env",
}

export async function action(options) {
  const key = "AUTH_SECRET"
  const value = randomString()
  if (options.raw) return console.log(value)

  const line = `${key}="${value}"`
  const message = {
    introClipboard:
      "Secret generated. It has been copied to your clipboard, paste it to your .env/.env.local file to continue.",
    introCopy:
      "Secret generated. Copy it to your .env/.env.local file (depending on your framework):",
    value: `\n${line}`,
  }

  if (options.copy) {
    try {
      write(line)
      console.log(message.introClipboard)
    } catch (error) {
      console.error(y.red(error))
      console.log(message.introCopy)
    } finally {
      console.log(message.value)
      process.exit(0)
    }
  }

  if (options.write) {
    try {
      const framework = await detectFramework()
      if (framework === "unknown") {
        return console.log(
          `No framework detected. Currently supported frameworks are: ${y.bold(
            Object.keys(frameworkDotEnvFile).join(", ")
          )}`
        )
      }
      const dotEnvFile = frameworkDotEnvFile[framework]
      await updateEnvFile(
        dotEnvFile,
        join(process.cwd(), dotEnvFile),
        key,
        value
      )
    } catch (error) {
      console.error(y.red(error))
    }
  }
}

/**
 * Update a key-value pair to a .env file
 * @param {string} file
 * @param {string} envPath
 * @param {string} key
 * @param {string} value
 */
async function updateEnvFile(file, envPath, key, value) {
  let content = ""
  const line = `${key}="${value}" # Added by \`npx auth\`. Read more: https://cli.authjs.dev`
  try {
    await readFile(envPath, "utf-8")
    content = await readFile(envPath, "utf-8")
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
  if (content) await writeFile(envPath, content)
}
