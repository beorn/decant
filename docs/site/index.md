---
layout: home

hero:
  name: "decant"
  text: "Clarity without the clutter"
  tagline: "Debug logging, structured logs, and distributed tracing — integrated into one ~3KB library. One dependency, zero-overhead via optional chaining."
  actions:
    - theme: brand
      text: The Journey
      link: /guide/journey
    - theme: alt
      text: View on GitHub
      link: https://github.com/beorn/decant

features:
  - title: "Debug Logging"
    details: "Namespace filtering with DEBUG=myapp,-myapp:noisy — same ergonomics as the debug package. Conditional output that costs nothing when disabled."
  - title: "Structured Logs"
    details: "Structured logging with levels, pretty console in development, JSON in production. Dual output format switches automatically via NODE_ENV."
  - title: "Distributed Tracing"
    details: "Built-in spans with automatic timing, parent-child tracking, trace IDs, and traceparent headers. All integrated — no separate SDK to wire up."
  - title: Zero-Overhead via ?.
    details: "Optional chaining skips the entire call — including argument evaluation — when a level is disabled. 22x faster than noop functions for expensive arguments."
  - title: ~3KB, One Dependency
    details: "Just picocolors for terminal colors. Native TypeScript, ESM-only. Runs on Node, Bun, and Deno."
  - title: One Unified Pipeline
    details: "Debug output, structured logs, and distributed traces share the same namespace tree, the same output pipeline, and the same zero-overhead pattern."
---

## Quick Start

```bash
bun add decant
```

```typescript
import { createLogger } from "decant"

const log = createLogger("myapp")

// ?. skips the entire call — including argument evaluation — when the level is disabled (near-zero cost)
log.info?.("server started", { port: 3000 })
log.debug?.("cache hit", { key: "user:42" })
log.error?.(new Error("connection lost"))

// Spans time operations automatically
{
  using span = log.span("db:query", { table: "users" })
  const users = await db.query("SELECT * FROM users")
  span.spanData.count = users.length
}
// Output: SPAN myapp:db:query (45ms) {count: 100, table: "users"}
```
