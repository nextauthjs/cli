// TODO: Get this programmatically
export const frameworks = {
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

export const action = (framework) => {
  if (!framework) {
    return console.log(`
Supported frameworks are: ${Object.keys(frameworks).join(", ")}`)
  }
  const { src, demo } = frameworks[framework]
  console.log(`
Source code: ${src}
Deployed demo: ${demo}`)
}
