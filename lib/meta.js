// @ts-check

// TODO: Get these programmatically

export const frameworks = {
  next: {
    name: "Next.js",
    src: "https://github.com/nextauthjs/next-auth-example",
    demo: "https://next-auth-example.vercel.app",
  },
  sveltekit: {
    name: "SvelteKit",
    src: "https://github.com/nextauthjs/sveltekit-auth-example",
    demo: "https://sveltekit-auth-example.vercel.app",
  },
  express: {
    name: "Express",
    src: "https://github.com/nextauthjs/express-auth-example",
    demo: "https://express-auth-example.vercel.app",
  },
}

export const providers = {
  github: "GitHub",
  google: "Google",
  resend: "Resend",
  twitter: "Twitter",
}

export const adapters = {
  none: "None",
  drizzle: "Drizzle",
  prisma: "Prisma",
}
