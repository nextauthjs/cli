// @ts-check

import * as y from "yoctocolors"
import { write } from "../lib/clipboard/index.js"
import { detectFramework } from "../lib/detect.js"
import { join } from "node:path"
import { updateEnvFile } from "../lib/write-env.js"
import { frameworks } from "../lib/meta.js"

/** Web compatible method to create a random string of a given length */
function randomString(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  // @ts-expect-error
  return Buffer.from(bytes, "base64").toString("base64")
}

/**
 * @param {{
 *  copy?: boolean
 *  path?: string
 *  raw?: boolean
 *  write?:boolean
 * }} options
 */
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

  try {
    const framework = await detectFramework(options.path)
    if (framework === "unknown") {
      return console.log(
        `No framework detected. Currently supported frameworks are: ${y.bold(
          Object.keys(frameworks).join(", ")
        )}`
      )
    }

    await updateEnvFile(options.path, key, value)
  } catch (error) {
    console.error(y.red(error))
  }
}
