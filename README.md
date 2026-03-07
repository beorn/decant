# decant

[![Tests](https://github.com/beorn/decant/actions/workflows/test.yml/badge.svg)](https://github.com/beorn/decant/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Clarity without the clutter. One library that replaces your debug logger, your structured logger, and your tracing SDK. **~3KB**, one dependency ([picocolors](https://github.com/alexeyraspopov/picocolors)).

Most projects wire together three separate tools: **debug** for conditional verbose output, **pino/winston** for structured production logs, and **OpenTelemetry** for distributed tracing. decant unifies all three — same namespace tree, same output pipeline, same `?.` zero-overhead pattern. Every logger is a potential span: call `.span()` and it becomes one, with automatic timing, parent-child tracking, and trace IDs.

Read **[The Journey](docs/guide.md)** for the full story.

## Install

```bash
bun add decant    # or: npm install decant
```

## Quick Start

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

## Why Another Logger?

Most loggers waste work when logging is disabled:

```typescript
// Pino, Winston, Bunyan -- args are ALWAYS evaluated
log.debug(`state: ${JSON.stringify(computeExpensiveState())}`)
// computeExpensiveState() runs even when debug is off
```

decant uses optional chaining to skip argument evaluation entirely:

```typescript
// decant -- args are NOT evaluated when disabled
log.debug?.(`state: ${JSON.stringify(computeExpensiveState())}`)
// computeExpensiveState() never runs when debug is off -- 22x faster
```

| Scenario                    | Traditional (noop)     | Optional chaining (`?.`) |
| --------------------------- | ---------------------- | ------------------------ |
| Cheap args disabled         | 2168M ops/s (0.5ns)    | 1406M ops/s (0.7ns)      |
| **Expensive args disabled** | **17M ops/s (57.6ns)** | **408M ops/s (2.5ns)**   |

For cheap arguments the difference is negligible (~0.2ns). For expensive arguments -- string interpolation, JSON serialization, state computation -- optional chaining is **22x faster**.

## Features

- **Namespace hierarchy** — organize logs with `:` separators. `log.logger("db")` creates `myapp:db`. Children inherit parent context.
- **Spans** — time any operation with `using span = log.span("name")`. Automatic duration, parent-child tracking, and trace IDs. *(Uses TC39 [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management); call `span.end()` manually if your runtime doesn't support `using` yet.)*
- **Lazy messages** — `log.debug?.(() => expensiveString())` skips the function entirely when disabled.
- **Child context** — `log.child({ requestId })` adds structured fields to every message in the chain.
- **Dual output** — pretty console in development, structured JSON in production (`NODE_ENV=production` or `LOG_FORMAT=json`).
- **File writer** — `addWriter()` + `createFileWriter()` for buffered file output with auto-flush.
- **Worker threads** — forward logs from workers to the main thread with full type safety (`decant/worker`).
- **Drop-in debug replacement** — reads `DEBUG=myapp:*` just like the debug package. Swap your imports in minutes.

## Documentation

- **[The Journey](docs/guide.md)** — progressive guide from first log to full observability
- **[Full docs site](https://beorn.codes/decant/)** — guides, API reference, migration guides
- [Comparison](docs/comparison.md) — vs Pino, Winston, Bunyan, debug
- [Migration from debug](docs/migration-from-debug.md) — step-by-step migration guide

## Environment Variables

| Variable       | Values                                  | Effect                                  |
| -------------- | --------------------------------------- | --------------------------------------- |
| `LOG_LEVEL`    | trace, debug, info, warn, error, silent | Minimum output level                    |
| `LOG_FORMAT`   | console, json                           | Output format                           |
| `DEBUG`        | `*`, namespace prefixes, `-prefix`      | Namespace filter (like `debug` package) |
| `TRACE`        | `1`, `true`, or namespace prefixes      | Enable span output                      |
| `TRACE_FORMAT` | json                                    | Force JSON for spans                    |
| `NODE_ENV`     | production                              | Auto-enable JSON format                 |

## API

| Function | Description |
|----------|-------------|
| `createLogger(name, props?)` | Create a logger (disabled levels return `undefined` for `?.`) |
| `.trace?.()` / `.debug?.()` / `.info?.()` / `.warn?.()` / `.error?.()` | Log at level (message + optional data) |
| `.logger(namespace)` | Create child logger with extended namespace |
| `.span(namespace, props?)` | Create timed span (implements `Disposable`) |
| `.child(context)` | Create child with structured context fields |
| `addWriter(fn)` / `createFileWriter(path)` | Custom output writers |
| `setLogLevel()` / `setLogFormat()` / `enableSpans()` | Runtime configuration |
| `createWorkerLogger()` / `createWorkerLogHandler()` | Worker thread support (`decant/worker`) |

See the [full API reference](docs/api-reference.md) for all functions and options.

## License

[MIT](LICENSE)
