// @ts-check
import { exec } from "node:child_process"
import { existsSync } from "node:fs"

const env = ["LC_CTYPE=UTF-8"]

function findClipboardProgram() {
  if (existsSync("/bin/wl-copy")) {
    return { cmd: "/bin/wl-copy", env: ["WAYLAND_DISPLAY=wayland-1", ...env] }
  } else if (existsSync("/bin/xclip")) {
    return { cmd: "/bin/xclip", env: [...env] }
  } else if (existsSync("/bin/xsel")) {
    return { cmd: "/bin/xsel" }
  }
  return null
}

const clipboard = {
  copy(options) {
    const program = findClipboardProgram()
    if (!program?.cmd) {
      throw new Error("No clipboard program found for your machine.")
    }
    let envVarString = ""
    if (program.env) {
      envVarString = program.env.map((envVar) => `${envVar}`).join(" ")
    }
    const bashCmd = `DISPLAY=:0 ${envVarString} ${program.cmd} "${options.input}"`
    exec(bashCmd)
  },
}

export default clipboard
