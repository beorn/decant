# Context Propagation

Import from `loggily/context`. **Node.js/Bun only** -- not available in browser environments.

## enableContextPropagation

```typescript
function enableContextPropagation(): void
function disableContextPropagation(): void
function isContextPropagationEnabled(): boolean
```

Enable AsyncLocalStorage-based context propagation. When enabled:

- New spans automatically parent to the current context span (even across different loggers)
- Log messages are auto-tagged with `trace_id` and `span_id`

```typescript
import { enableContextPropagation } from "loggily/context"

enableContextPropagation()

const log = createLogger("myapp")
{
  using span = log.span("request")
  // All logs within this async context include trace_id and span_id
  log.info?.("handling") // auto-tagged with trace_id, span_id

  // Child spans from ANY logger auto-parent via AsyncLocalStorage
  const db = createLogger("db")
  const dbSpan = db.span("query") // parentId = span.id
  dbSpan.end()
}
```

## getCurrentSpan

```typescript
function getCurrentSpan(): SpanContext | null

interface SpanContext {
  readonly spanId: string
  readonly traceId: string
  readonly parentId: string | null
}
```

Get the current span context from AsyncLocalStorage. Returns `null` if no span is active or context propagation is disabled.

## runInSpanContext

```typescript
function runInSpanContext<T>(context: SpanContext, fn: () => T): T
```

Run a function within a specific span context. Useful for explicit context scoping in request handlers.

```typescript
import { runInSpanContext } from "loggily/context"

const result = runInSpanContext({ spanId: "custom", traceId: "trace-1", parentId: null }, () => {
  // getCurrentSpan() returns the custom context here
  return handleRequest()
})
```
