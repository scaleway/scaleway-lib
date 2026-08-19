export const ignorePatterns = [
  "**/node_modules",
  "**/.git",

  // ── Build / framework output ──────────────────────────────────────
  "**/dist",
  "**/build",
  "**/out",
  "**/.next",
  "**/.open-next",
  "**/.nuxt",
  "**/.output",
  "**/.svelte-kit",
  "**/.vitepress/cache",
  "**/.vitepress/dist",
  "**/.turbo",
  "**/.vercel",
  "**/.netlify",
  "**/.wrangler",
  "**/.wrangler-dry-run",
  "**/.docusaurus",
  "**/.cache",
  "**/.parcel-cache",
  "**/.vite",
  "**/.astro",
  "**/_astro",
  "**/public/build",
  "**/storybook-static",

  // ── Generated code ────────────────────────────────────────────────
  "**/_generated",
  "**/*.gen.*",
  "**/*.generated.*",
  "**/*.auto.*",
  "**/generated",
  "**/auto-generated",
  "**/codegen",
  "**/__generated__",
  "**/graphql-types.*",
  "**/schema.d.ts",
  "**/schema.graphql.d.ts",
  "**/*.d.ts.map",
  "**/.yarn",

  // ── Test coverage ─────────────────────────────────────────────────
  "**/coverage",
  "**/.nyc_output",

  // ── Mobile ────────────────────────────────────────────────────────
  "**/.expo",
  "**/.expo-shared",
  "**/android/build",
  "**/ios/build",
  "**/DerivedData/**/*",

  // ── Lock files ────────────────────────────────────────────────────
  "**/bun.lock",
  "**/bun.lockb",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",

  // ── Framework type definitions ────────────────────────────────────
  "**/next-env.d.ts",
  "**/worker-configuration.d.ts",
];
