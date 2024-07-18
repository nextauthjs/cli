import { link } from "./markdown.js"
import { secret } from "../commands/index.js"
import * as y from "yoctocolors"

export async function ensureAuthSecretExist() {
  console.log(
    y.dim(
      `\nEnsuring that ${link(
        "AUTH_SECRET",
        "https://authjs.dev/getting-started/installation#setup-environment"
      )} is set...`
    )
  )

  await secret.action({})
}
