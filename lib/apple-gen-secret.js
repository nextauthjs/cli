import fs from "node:fs"
import path from "node:path"
import * as y from "yoctocolors"

/**
 * Generates an Apple client secret.
 *
 * @param {object} options
 * @param {string} options.teamId - Apple Team ID.
 * @param {string} options.clientId - Apple Client ID.
 * @param {string} options.keyId - Apple Key ID.
 * @param {string} options.privateKey - Apple Private Key.
 * @param {number} options.expiresInDays - Days until the secret expires.
 *
 * @see https://developer.apple.com/documentation/accountorganizationaldatasharing/creating-a-client-secret
 */
export async function appleGenSecret({
  teamId: iss,
  clientId: sub,
  keyId: kid,
  privateKey,
  expiresInDays,
}) {
  const expiresIn = 86400 * expiresInDays
  const exp = Math.ceil(Date.now() / 1000) + expiresIn

  const secret = await signJWT(sub, iss, kid, privateKey, exp)

  console.log(
    y.green(
      `Apple client secret generated. Valid until: ${new Date(exp * 1000)}`
    )
  )

  return secret
}

/**
 *
 * @param {string} sub - Apple client ID.
 * @param {string} iss - Apple team ID.
 * @param {string} kid - Apple key ID.
 * @param {string} privateKeyPath - Apple private key.
 * @param {Date} exp - Expiry date.
 */
async function signJWT(sub, iss, kid, privateKeyPath, exp) {
  const header = { alg: "ES256", kid }

  const payload = {
    iss,
    iat: Date.now() / 1000,
    exp,
    aud: "https://appleid.apple.com",
    sub,
  }

  const parts = [
    toBase64Url(encoder.encode(JSON.stringify(header))),
    toBase64Url(encoder.encode(JSON.stringify(payload))),
  ]

  const privateKey = fs
    .readFileSync(path.resolve(privateKeyPath), "utf8")
    .replace(/-----BEGIN PRIVATE KEY-----|\n|-----END PRIVATE KEY-----/g, "")

  const signature = await sign(parts.join("."), privateKey)

  parts.push(toBase64Url(signature))
  return parts.join(".")
}

const encoder = new TextEncoder()
function toBase64Url(data) {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

async function sign(data, private_key) {
  const pem = private_key.replace(
    /-----BEGIN PRIVATE KEY-----|\n|-----END PRIVATE KEY-----/g,
    ""
  )
  const binaryDerString = atob(pem)
  const binaryDer = new Uint8Array(
    [...binaryDerString].map((char) => char.charCodeAt(0))
  )

  const privateKey = await globalThis.crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"]
  )

  return await globalThis.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    encoder.encode(data)
  )
}
