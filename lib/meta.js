// @ts-check

// TODO: Get these programmatically

/**
 * @typedef {"next" | "express" | "sveltekit"} SupportedFramework
 */

export const frameworks = {
  next: {
    name: "Next.js",
    src: "https://github.com/nextauthjs/next-auth-example",
    demo: "https://next-auth-example.vercel.app",
    path: "/api/auth",
    port: 3000,
    envFile: ".env.local",
  },
  sveltekit: {
    name: "SvelteKit",
    src: "https://github.com/nextauthjs/sveltekit-auth-example",
    demo: "https://sveltekit-auth-example.vercel.app",
    path: "/auth",
    port: 5173,
    envFile: ".env",
  },
  express: {
    name: "Express",
    src: "https://github.com/nextauthjs/express-auth-example",
    demo: "https://express-auth-example.vercel.app",
    path: "/auth",
    port: 3000,
    envFile: ".env",
  },
}

export const providers = {
  "42-school": { name: "42 School", setupUrl: undefined },
  apple: {
    name: "Apple",
    setupUrl:
      "https://developer.apple.com/account/resources/identifiers/list/serviceId",
  },
  asgardeo: { name: "Asgardeo", setupUrl: undefined },
  auth0: { name: "Auth0", setupUrl: undefined },
  authentik: { name: "Authentik", setupUrl: undefined },
  "azure-ad-b2c": { name: "Azure AD B2C", setupUrl: undefined },
  "azure-ad": { name: "Azure AD", setupUrl: undefined },
  "azure-devops": { name: "Azure DevOps", setupUrl: undefined },
  battlenet: { name: "Battlenet", setupUrl: undefined },
  beyondidentity: { name: "Beyond Identity", setupUrl: undefined },
  box: { name: "Box", setupUrl: undefined },
  "boxyhq-saml": { name: "Boxyhq SAML", setupUrl: undefined },
  bungie: { name: "Bungie", setupUrl: undefined },
  "click-up": { name: "Click-up", setupUrl: undefined },
  cognito: { name: "Cognito", setupUrl: undefined },
  coinbase: { name: "Coinbase", setupUrl: undefined },
  credentials: { name: "Credentials", setupUrl: undefined },
  descope: { name: "Descope", setupUrl: undefined },
  discord: { name: "Discord", setupUrl: undefined },
  dribbble: { name: "Dribbble", setupUrl: undefined },
  dropbox: { name: "Dropbox", setupUrl: undefined },
  "duende-identity-server6": {
    name: "Duende Identity Server 6",
    setupUrl: undefined,
  },
  email: { name: "Email", setupUrl: undefined },
  eveonline: { name: "Eveonline", setupUrl: undefined },
  facebook: { name: "Facebook", setupUrl: undefined },
  faceit: { name: "Faceit", setupUrl: undefined },
  foursquare: { name: "Foursquare", setupUrl: undefined },
  freshbooks: { name: "Freshbooks", setupUrl: undefined },
  fusionauth: { name: "FusionAuth", setupUrl: undefined },
  github: {
    name: "GitHub",
    setupUrl: "https://github.com/settings/applications/new",
    instructions: `\
1. Set *Application name* (can be anything)
2. Set *Homepage URL* (your business/website, but can be anything)
3. Paste the redirect URI (on your clipboard) to *Authorization callback URL*
4. Click *Register application*
5. Paste the *Client ID* back here
6. Click *Generate a new client secret*
7. Paste the *Client secret* back here (Note: This is the only time you can see it)`,
  },
  gitlab: { name: "GitLab", setupUrl: undefined },
  google: {
    name: "Google",
    setupUrl: "https://console.cloud.google.com/apis/credentials/oauthclient",
    instructions: `\
1. Choose *Application Type: Web Application*
2. Paste the redirect URI (on your clipboard) to *Authorized redirect URIs*
3. Fill out the rest of the form
4. Click *Create*`,
  },
  hubspot: { name: "Hubspot", setupUrl: undefined },
  "identity-server4": { name: "Identity Server 4", setupUrl: undefined },
  instagram: { name: "Instagram", setupUrl: undefined },
  kakao: { name: "Kakao", setupUrl: undefined },
  keycloak: { name: "Keycloak", setupUrl: undefined },
  line: { name: "Line", setupUrl: undefined },
  linkedin: { name: "LinkedIn", setupUrl: undefined },
  mailchimp: { name: "Mailchimp", setupUrl: undefined },
  mailru: { name: "Mail.ru", setupUrl: undefined },
  mastodon: { name: "Mastodon", setupUrl: undefined },
  mattermost: { name: "Mattermost", setupUrl: undefined },
  medium: { name: "Medium", setupUrl: undefined },
  "microsoft-entra-id": { name: "Microsoft Entra ID", setupUrl: undefined },
  naver: { name: "Naver", setupUrl: undefined },
  netlify: { name: "Netlify", setupUrl: undefined },
  netsuite: { name: "Netsuite", setupUrl: undefined },
  nodemailer: { name: "Nodemailer", setupUrl: undefined },
  notion: { name: "Notion", setupUrl: undefined },
  okta: { name: "Okta", setupUrl: undefined },
  onelogin: { name: "Onelogin", setupUrl: undefined },
  "ory-hydra": { name: "Ory Hydra", setupUrl: undefined },
  osso: { name: "Osso", setupUrl: undefined },
  osu: { name: "Osu", setupUrl: undefined },
  passage: { name: "Passage", setupUrl: undefined },
  passkey: { name: "Passkey", setupUrl: undefined },
  patreon: { name: "Patreon", setupUrl: undefined },
  pinterest: { name: "Pinterest", setupUrl: undefined },
  pipedrive: { name: "Pipedrive", setupUrl: undefined },
  postmark: { name: "Postmark", setupUrl: undefined },
  reddit: { name: "Reddit", setupUrl: undefined },
  resend: { name: "Resend", setupUrl: undefined },
  salesforce: { name: "Salesforce", setupUrl: undefined },
  sendgrid: { name: "Sendgrid", setupUrl: undefined },
  slack: { name: "Slack", setupUrl: undefined },
  spotify: { name: "Spotify", setupUrl: undefined },
  strava: { name: "Strava", setupUrl: undefined },
  tiktok: { name: "Tiktok", setupUrl: undefined },
  todoist: { name: "Todoist", setupUrl: undefined },
  trakt: { name: "Trakt", setupUrl: undefined },
  twitch: { name: "Twitch", setupUrl: undefined },
  twitter: { name: "Twitter", setupUrl: undefined },
  "united-effects": { name: "United Effects", setupUrl: undefined },
  vk: { name: "Vk", setupUrl: undefined },
  webex: { name: "Webex", setupUrl: undefined },
  wikimedia: { name: "Wikimedia", setupUrl: undefined },
  wordpress: { name: "Wordpress", setupUrl: undefined },
  workos: { name: "WorkOS", setupUrl: undefined },
  yandex: { name: "Yandex", setupUrl: undefined },
  zitadel: { name: "Zitadel", setupUrl: undefined },
  zoho: { name: "Zoho", setupUrl: undefined },
  zoom: { name: "Zoom", setupUrl: undefined },
}

export const adapters = {
  none: "None",
  "adapter-azure-tables": "Azure Tables",
  d1: "d1",
  dgraph: "Dgraph",
  drizzle: "Drizzle",
  dynamodb: "DynamoDB",
  edgedb: "EdgeDB",
  fauna: "Fauna",
  firebase: "Firebase",
  hasura: "Hasura",
  kysely: "Kysely",
  "mikro-orm": "MikroORM",
  mongodb: "MongoDB",
  neo4j: "Neo4j",
  pg: "PostgreSQL",
  pouchdb: "PouchDB",
  prisma: "Prisma",
  sequelize: "Sequelize",
  supabase: "Supabase",
  surrealdb: "SurrealDB",
  typeorm: "TypeORM",
  unstorage: "Unstorage",
  "upstash-redis": "Upstash Redis",
  xata: "Xata",
}
