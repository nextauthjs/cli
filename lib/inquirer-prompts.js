import { input, password } from "@inquirer/prompts"
import * as y from "yoctocolors"

/**
 * @param {string} label
 * @param {string} [defaultValue]
 */
export async function promptInput(label, defaultValue) {
  return input({
    message: `Paste ${y.magenta(label)}:`,
    validate: (value) => !!value,
    default: defaultValue,
  })
}

/**
 * @param {string} label
 * @returns {Promise<string>}
 */
export async function promptPassword(label) {
  return password({
    message: `Paste ${y.magenta(label)}:`,
    mask: true,
    validate: (value) => !!value,
  })
}
