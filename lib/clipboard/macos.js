import { exec } from "node:child_process"

const env = {
  LC_CTYPE: "UTF-8", // eslint-disable-line unicorn/text-encoding-identifier-case
}

const clipboard = {
  copy: async (options) =>
    exec(`${Object.entries(env).flat().join("=")} pbcopy ${options.input}`),
}

export default clipboard
