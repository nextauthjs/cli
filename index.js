import { Command } from "commander"
// import pkg from "./package.json" assert { type: "json" }

import fs from "fs/promises"
const pkg = JSON.parse(await fs.readFile("./package.json"))
const { name, description, version } = pkg

try {
  // TODO: Remove when Node.js 18 is not maintained anymore
  globalThis.crypto ??= (await import("crypto")).webcrypto
} catch {}

/** Web compatible method to create a random string of a given length */
export function randomString(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  return Buffer.from(bytes, "base64").toString("base64")
}

new Command()
  .name(name)
  .description(description)
  .version(version)

  .command("secret")
  .description("Generate a random string.")
  .action(() => {
    console.log(`\
Secret generated. Copy it to your .env file:

AUTH_SECRET=${randomString()}`)
  })
  .parse(process.argv)
