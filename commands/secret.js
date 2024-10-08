// @ts-check

import * as y from "yoctocolors"
import clipboard from "clipboardy"
import { requireFramework } from "../lib/detect.js"
import { updateEnvFile } from "../lib/write-env.js"

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
      clipboard.writeSync(line)
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
    await requireFramework(options.path)
    await updateEnvFile({ [key]: value }, options.path)
  } catch (error) {
    console.error(y.red(error))
  }
}
