import { defineConfig } from "vitepress"

export default defineConfig({
  title: "decant",
  description: "Clarity without the clutter. Ergonomic unified logs, spans, and debugs for modern TypeScript.",
  base: "/decant/",

  themeConfig: {
    siteTitle: "decant",

    nav: [
      { text: "Guide", link: "/guide/journey" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/beorn/decant" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "The Journey", link: "/guide/journey" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Why decant?", link: "/guide/why" },
          ],
        },
        {
          text: "Features",
          items: [
            { text: "Zero-Overhead Logging", link: "/guide/zero-overhead" },
            { text: "Spans", link: "/guide/spans" },
            { text: "Worker Threads", link: "/guide/workers" },
          ],
        },
        {
          text: "Migration",
          items: [{ text: "From debug", link: "/guide/migration-from-debug" }],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Logger", link: "/api/logger" },
            { text: "Configuration", link: "/api/configuration" },
            { text: "Writers", link: "/api/writers" },
            { text: "Worker Thread", link: "/api/worker" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/beorn/decant" }],

    outline: { level: [2, 3] },

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright &copy; 2026 Bj&oslash;rn Stabell",
    },
  },
})
