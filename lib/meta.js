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
  discord: {
    name: "Discord",
    setupUrl: "https://discord.com/developers/applications",
    instructions: `\
      1. Click on *New Application*
      2. Set *Application name* (can be anything)
      3. Click on *OAuth2* in the side menu
      4. Click on *Add Redirect* and paste the callback URI (on your clipboard)
      5. Click on *Save Changes*
      6. Copy and paste the *Client ID*
      7. Copy and paste the *Client Secret*
      `,
  },
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
  linkedin: {
    name: "LinkedIn",
    setupUrl: "https://linkedin.com/developers/apps",
    instructions: `\
      1. Click on *Create app*
      2. Set *App name* (can be anything)
      3. Create a *LinkedIn page*
      4. Set *LinkedIn Page URL* (LinkedIn page you created)
      5. Set *App logo* (can be anything)
      6. Navigate to *Auth* in the top menu
      7. Set *Authorized redirect URLs for your app* (paste the callback URI on your clipboard)
      8. Copy and paste the *Client ID*
      9. Copy and paste the *Primary Client Secret*
      `,
  },
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
  twitter: {
    name: "Twitter",
    setupUrl: "https://developer.x.com/en/portal/dashboard",
    instructions: `\
1. Create a project
2. Set the *Project name* (can be anything)
3. Choose a use case, then click Next
4. Give it a description, then click Next
5. An app will be created for you
6. Set the app name
7. Click on *App Settings*
8. Click *Set up* under *User authentication settings*
9. Select *Web App, Automated App or Bot* at "Type of app" 
10. Add the callback URI (on your clipboard) to *Callback URLs* 
11. Fill out the other required fields (your website)
12. Copy and paste the *Client ID*
13. Copy and paste the *Client Secret*
14. Click *Done*`,
  },
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
