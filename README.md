# typecodec

> Under 1kB, fast, type-safe runtime validation of unknown data for TypeScript.

Examples: [Tests](./tests/index.test.ts) | [Benchmarks](./benchmarks/index.ts)

## Features

- **Small**: Zero dependencies and under 1kB minified and gzipped.
- **Fast**: Decoders are optimized more for speed than for very detailed error messages.
- **Immutable**: All functions and methods return new decoder instances.
- **Safe**: All decoders return newly constructed values, never the original input.
- **Universal**: Works both client-side (all modern browsers) and server-side (Node.js).
