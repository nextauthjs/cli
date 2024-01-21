import { InvalidArgumentError } from "commander"
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

const program = new Command()

program.name(name).description(description).version(version)

program
  .command("secret")
  .description("Generate a random string.")
  .action(() => {
    // TODO: Detect framework, check for existing value, and write automatically
    console.log(`
Secret generated. Copy it to your .env/.env.local file (depending on your framework):

AUTH_SECRET=${randomString()}`)
  })

// TODO: Get this programmatically
const frameworks = {
  nextjs: {
    src: "https://github.com/nextauthjs/next-auth-example",
    demo: "https://next-auth-example.vercel.app",
  },
  sveltekit: {
    src: "https://github.com/nextauthjs/sveltekit-auth-example",
    demo: "https://sveltekit-auth-example.vercel.app",
  },
  express: {
    src: "https://github.com/nextauthjs/express-auth-example",
    demo: "https://express-auth-example.vercel.app",
  },
}

program
  .command("framework")
  .argument("[framework]", "The framework to use.", (value) => {
    if (!value) return value
    if (Object.keys(frameworks).includes(value)) return value
    throw new InvalidArgumentError(
      `Valid frameworks are: ${supportedFrameworks.join(", ")}`
    )
  })
  .description("Clone a framework template.")
  .action((framework) => {
    if (!framework) {
      return console.log(`
Supported frameworks are: ${Object.keys(frameworks).join(", ")}`)
    }
    const { src, demo } = frameworks[framework]
    console.log(`
Source code: ${src}
Deployed demo: ${demo}`)
  })

program.parse(process.argv)
