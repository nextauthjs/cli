// @ts-check

import * as y from "yoctocolors"
import { input } from "@inquirer/prompts"
import { InkeepAI } from "@inkeep/ai-api"
import { ChatModeOptions } from "@inkeep/ai-api/models/components/index.js"
import * as ora from "ora"
import { link, markdownToAnsi, breakStringToLines } from "../lib/markdown.js"

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
