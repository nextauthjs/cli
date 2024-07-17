import { SignJWT } from "jose"
import { createPrivateKey } from "crypto"
import { join } from "node:path"
import { readFile, writeFile } from "node:fs/promises"
import { updateEnvFile } from "./write-env.js"
import { detectFramework } from "./detect.js"
import { frameworks } from "./meta.js"
import fs from "node:fs"
import * as y from "yoctocolors"

export async function appleGenSecret({
  teamId,
  clientId,
  keyId,
  envPath = "",
}) {
  const expiresIn = 86400 * 180
  const exp = Math.ceil(Date.now() / 1000) + expiresIn

  const framework = await detectFramework(envPath)
  const dotEnvFile = frameworks[framework]?.envFile
  const file = join(process.cwd(), envPath, dotEnvFile)

  if (!fs.existsSync(file)) {
    await writeFile(file, "")
    console.log(`📝 Created ${y.italic(file)}`)
  }

  const content = await readFile(file, "utf-8")

  if (!content) {
    console.error(
      y.red(
        `\nCould Not Find ${y.bold(
          "AUTH_APPLE_PRIVATE_KEY"
        )} value in ${dotEnvFile}\n`
      )
    )
    await writeFile(
      file,
      "AUTH_APPLE_PRIVATE_KEY= # Must starts with `-----BEGIN PRIVATE KEY-----`,"
    )
    process.exit(0)
  }

  const keyValueMatch = content.match(/AUTH_APPLE_PRIVATE_KEY="([^"]*)"/)
  const privateKey = keyValueMatch ? keyValueMatch[1].replace(/\\n/g, "\n") : ""

  const clientSecret = await new SignJWT({})
    .setAudience("https://appleid.apple.com")
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime(exp)
    .setSubject(clientId)
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .sign(createPrivateKey(privateKey.replace(/\\n/g, "\n")))

  await updateEnvFile({
    [`AUTH_APPLE_ID`]: clientId,
    [`AUTH_APPLE_SECRET`]: clientSecret,
  })

  console.log(
    y.green(
      `Apple client secret generated. Valid until: ${new Date(exp * 1000)}`
    )
  )
}
