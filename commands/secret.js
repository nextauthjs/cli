// @ts-check

import * as y from "yoctocolors"
import { write } from "../lib/clipboard/index.js"

/** Web compatible method to create a random string of a given length */
function randomString(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  // @ts-expect-error
  return Buffer.from(bytes, "base64").toString("base64")
}

export function action(options) {
  let value = randomString()
  if (options.raw) return console.log(value)

  value = `AUTH_SECRET="${value}"`
  if (!options.copy) return console.log(value)

  const message = {
    introClipboard:
      "Secret generated. It has been copied to your clipboard, paste it to your .env/.env.local file to continue.",
    introCopy:
      "Secret generated. Copy it to your .env/.env.local file (depending on your framework):",
    value: `\n${value}`,
  }

  // TODO: Detect framework, check for existing value, and write automatically
  try {
    write(value)
    console.log(message.introClipboard)
  } catch (error) {
    console.error(y.red(error))
    console.log(message.introCopy)
  } finally {
    console.log(message.value)
    process.exit(0)
  }
}
