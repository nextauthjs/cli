// @ts-check
import macos from "./macos.js"
import linux from "./linux.js"
import windows from "./windows.js"

const platformLib = { darwin: macos, win32: windows, linux }

export function write(input) {
  if (typeof input !== "string") {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  platformLib[process.platform].copy({ input })
}
