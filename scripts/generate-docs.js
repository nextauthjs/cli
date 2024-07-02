import { execSync } from "node:child_process"
import fs from "fs/promises"
import { join } from "path"
import { fileURLToPath } from "url"
const __dirname = fileURLToPath(new URL(".", import.meta.url))

let output = execSync("node index.js --help", {
  encoding: "utf-8",
})

// Drop description
output = output.replace(
  /(?<=Usage: auth \[options\] \[command\]\n\n)[\s\S]*?(?=Options:)/,
  ""
)

const readmePath = join(__dirname, "./README.md")
const readme = await fs.readFile(readmePath, "utf-8")

const updatedReadme = readme.replace(
  /(?<=<!-- GENERATED START -->\n\n```sh\n)[\s\S]*?(?=```\n\n<!-- GENERATED END -->)/,
  output
)

await fs.writeFile(readmePath, updatedReadme, "utf-8")
