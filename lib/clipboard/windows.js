import { exec } from "node:child_process"

const clipboard = {
  copy: async (options) => exec("clip", options.input),
}

export default clipboard
