import macos from "./macos.js"
import linux from "./linux.js"
import windows from "./windows.js"

const platformLib = (() => {
  switch (process.platform) {
    case "darwin": {
      return macos
    }
    case "win32": {
      return windows
    }
    default: {
      return linux
    }
  }
})()

export const write = (text) => {
  if (typeof text !== "string") {
    throw new TypeError(`Expected a string, got ${typeof text}`)
  }

  try {
    platformLib.copy({ input: text })
  } catch (error) {
    console.log(error)
  }
}
