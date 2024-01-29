// @ts-check
import { exec } from "node:child_process"

const env = { LC_CTYPE: "UTF-8" }

const clipboard = {
  copy: async (options) =>
    exec(`${Object.entries(env).flat().join("=")} pbcopy ${options.input}`),
}

export default clipboard
