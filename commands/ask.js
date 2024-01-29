// @ts-check

import * as y from "yoctocolors"
import { input } from "@inquirer/prompts"

export async function action() {
  try {
    const query = await input({ message: "What would you like to know: " })

    const response = await fetch("https://authjs.dev/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()
    if (!response.ok) return console.error(y.red(result))

    console.log(result)
  } catch (e) {
    if (!(e instanceof Error)) return
    if (e.message.startsWith("User force closed")) return

    console.error(y.red(e.stack ?? e.message))
  }
}
