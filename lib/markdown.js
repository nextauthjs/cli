// @ts-check
import * as y from "yoctocolors"

// double char markdown matchers
const BOLD_REGEX = /\*{2}([^*]+)\*{2}/g
const UNDERLINE_REGEX = /_{2}([^_]+)_{2}/g
const STRIKETHROUGH_REGEX = /~{2}([^~]+)~{2}/g
const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

// single char markdown matchers
const ITALIC_REGEX = /(?<!\\)\*(.+)(?<!\\)\*|(?<!\\)_(.+)(?<!\\)_/g

export function link(text, url) {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`
}

/**
 * @param {string} input
 * @returns {string}
 */
export function markdownToAnsi(input) {
  input = input.replace(BOLD_REGEX, (...args) => y.bold(args[1]))
  input = input.replace(UNDERLINE_REGEX, (...args) => y.underline(args[1]))
  input = input.replace(STRIKETHROUGH_REGEX, (...args) =>
    y.strikethrough(args[1])
  )
  input = input.replace(ITALIC_REGEX, (...args) => y.italic(args[1] || args[2]))
  input = input.replace(/(?<!\\)\\/g, "")

  // @ts-expect-error
  input = input.replaceAll(LINK_REGEX, (...args) =>
    y.blue(" " + link(args[2], args[1]))
  )
  return input
}

/**
 * @param {string} str
 * @param {number} maxLineLength
 * @returns {string}
 */
export function breakStringToLines(str, maxLineLength) {
  let result = ""
  let line = ""

  str.split(" ").forEach((word) => {
    if (line.length + word.length + 1 > maxLineLength) {
      result += line + "\n"
      line = word
    } else {
      if (line) line += " "
      line += word
    }
  })

  if (line) result += line

  return result
}
