// @ts-check

import * as y from "yoctocolors"
import { input } from "@inquirer/prompts"
import { InkeepAI } from "@inkeep/ai-api"
import { ChatModeOptions } from "@inkeep/ai-api/models/components/index.js"
import * as ora from "ora"

const INKEEP_API_KEY = "e32967a320a48a2cd933922099e1f38f6ebb4ab62ff98343"
const INKEEP_INTEGRATION_ID = "clvn0fdez000cip0e5w2oaobw"

const inkeepAI = new InkeepAI({ apiKey: INKEEP_API_KEY })

function randomSpinner() {
  const allSpinners = Object.keys(ora.spinners)
  const max = allSpinners.length - 1
  const random = Math.floor(Math.random() * (max + 1))
  return allSpinners[random]
}

export async function action({ stream = false, raw = false }) {
  const format = raw ? (i) => i : markdownToAnsi
  const newLocal = randomSpinner()
  const spinner = ora.default({
    text: "Understanding question",
    // @ts-expect-error
    spinner: newLocal,
  })
  try {
    const content = await input({ message: "What would you like to know: " })

    spinner.start()

    const result = await inkeepAI.chatSession.create({
      integrationId: INKEEP_INTEGRATION_ID,
      stream,
      chatSession: { messages: [{ content, role: "user" }] },
      chatMode: ChatModeOptions.Auto,
    })

    if (stream) {
      if (result.chatResultStream == null) {
        throw new Error("failed to create stream: received null value")
      }

      spinner.stop().clear()

      for await (const event of result.chatResultStream) {
        if (event.event === "message_chunk") {
          const content = format(event.data.contentChunk)
          process.stdout.write(content)
        }
      }
    } else {
      const answer = result.chatResult?.message.content
      if (!answer) return console.error(y.red("Could not get an answer."))

      console.log(breakStringToLines(format(answer), 80))
    }

    console.log(
      y.italic(
        `\n\nAnswered by ${y.cyan(
          link("Inkeep AI", "https://inkeep.com")
        )}. Check out the official ${y.magenta(
          link("Auth.js", "https://authjs.dev")
        )} docs.`
      )
    )
  } catch (e) {
    spinner.stop().clear()
    if (!(e instanceof Error)) return
    if (e.message.startsWith("User force closed")) return

    console.error(y.red(e.stack ?? e.message))
    console.error(
      y.bold(
        y.red(
          `\n This is a bug. Please report it on ${link(
            "GitHub",
            "https://github.com/nextauthjs/auth-cli/issues"
          )}.`
        )
      )
    )
  } finally {
    spinner.stop().clear()
  }
}

// double char markdown matchers
const BOLD_REGEX = /\*{2}([^*]+)\*{2}/g
const UNDERLINE_REGEX = /_{2}([^_]+)_{2}/g
const STRIKETHROUGH_REGEX = /~{2}([^~]+)~{2}/g
const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

// single char markdown matchers
const ITALIC_REGEX = /(?<!\\)\*(.+)(?<!\\)\*|(?<!\\)_(.+)(?<!\\)_/g

function link(text, url) {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`
}

/**
 * @param {string} input
 * @returns {string}
 */
function markdownToAnsi(input) {
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
function breakStringToLines(str, maxLineLength) {
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
