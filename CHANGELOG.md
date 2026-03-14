# Changelog

All notable changes to Loggily will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-13

### Added

- **Lightweight tracing** -- W3C-compatible trace/span ID generation, `traceparent()` header formatting, head-based sampling
- `setIdFormat()` / `getIdFormat()` -- Switch between `"simple"` (sp_1, tr_1) and `"w3c"` (hex) ID formats
- `traceparent(spanData, options?)` -- Format W3C traceparent headers with configurable sampled flag
- `setSampleRate()` / `getSampleRate()` -- Head-based sampling for traces
- **Context propagation** -- `enableContextPropagation()` via AsyncLocalStorage (`loggily/context`)
- `getCurrentSpan()` / `runInSpanContext()` -- Access and scope span context
- Auto-tagging of log messages with `trace_id` and `span_id` when context propagation is active
- Vendored ANSI colors (replaced picocolors dependency) -- zero external dependencies

### Fixed

- Span collection API now correctly collects spans on disposal
- `formatConsole()` uses `safeStringify()` -- no longer throws on circular refs, bigint, or symbols
- `formatJSON()` uses shared `safeStringify()` -- handles bigint, symbols, and Error objects
- Worker span forwarding preserves original worker IDs and timing instead of creating new spans
- Worker `postMessage` failures send diagnostic fallback messages instead of silently dropping logs
- Worker console handlers use `safeStringify()` -- no longer throw on BigInt or circular refs
- `traceparent()` accepts `{ sampled }` option instead of always marking traces as sampled
- File writer preserves buffer on `writeSync` failure (buffer cleared only after successful write)
- `close()` always runs cleanup (closeSync + removeListener) even when flush throws
- Non-LIFO `end()` calls no longer corrupt AsyncLocalStorage context

### Changed

- `exitSpanContext()` now captures and restores exact previous context snapshots
- `writeSpan()` exported for internal cross-module use (worker span forwarding)
- Extracted duplicated console message formatting in worker handlers into shared helpers

## [0.2.0] - 2026-03-04

### Added

- **Lazy messages** -- Pass `() => string` functions that are only called when the level is enabled
- **Child context loggers** -- `log.child({ requestId: "abc" })` creates a logger with structured context fields in every message
- **LOG_FORMAT env var** -- `LOG_FORMAT=json` explicitly enables structured JSON output
- `setLogFormat()` / `getLogFormat()` -- Programmatic log format control
- `setDebugFilter()` / `getDebugFilter()` -- Programmatic namespace filtering (like `DEBUG` env var)
- **File writer** -- `createFileWriter(path, opts?)` for buffered file output with auto-flush
- **Writer system** -- `addWriter(fn)` to subscribe to all formatted log output
- `setOutputMode()` / `getOutputMode()` -- Control output destination (`console`, `stderr`, `writers-only`)
- `setSuppressConsole()` -- Suppress console output while writers still receive
- Comprehensive test suite (153 tests)

### Changed

- `createLogger()` now returns a `ConditionalLogger` directly (no separate function needed)
- Improved documentation with full API reference and comparison guides

## [0.1.0] - 2026-01-15

### Added

- Initial release
- `createLogger(name, props?)` -- Create structured logger
- Logger methods: `trace`, `debug`, `info`, `warn`, `error`
- Child loggers with `.logger(namespace, props?)`
- Span timing with `.span(namespace, props?)` and `using` keyword support
- `SpanData` with id, traceId, parentId, startTime, endTime, duration
- Custom span attributes via `span.spanData.key = value`
- Configuration via environment variables: `LOG_LEVEL`, `TRACE`, `TRACE_FORMAT`
- Programmatic configuration: `setLogLevel`, `getLogLevel`, `enableSpans`, `disableSpans`, `spansAreEnabled`
- `setTraceFilter()` / `getTraceFilter()` -- Namespace-based span output control
- Dual output format: pretty console (dev) and JSON (production)
- Worker thread support: `createWorkerLogger`, `createWorkerLogHandler`, `forwardConsole`
- Span collection for testing: `startCollecting`, `stopCollecting`, `getCollectedSpans`, `clearCollectedSpans`
- `resetIds()` for deterministic tests
