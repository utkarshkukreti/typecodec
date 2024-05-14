<div align="center">

# typecodec

Under 1kB, fast, type-safe runtime validation of unknown data for TypeScript.

![Version](https://img.shields.io/npm/v/typecodec?style=for-the-badge)
![Downloads](https://img.shields.io/npm/dt/typecodec?style=for-the-badge)
![License](https://img.shields.io/npm/l/typecodec?style=for-the-badge)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/typecodec?style=for-the-badge)](https://bundlejs.com/?q=typecodec)

</div>

Examples: [Tests](./tests/index.test.ts) | [Benchmarks](./benchmarks/index.ts)

## Features

- **Small**: Zero dependencies and under 1kB minified and gzipped.
- **Fast**: Decoders are optimized more for speed than for very detailed error messages.
- **Immutable**: All functions and methods return new decoder instances.
- **Safe**: All decoders return newly constructed values, never the original input.
- **Universal**: Works both client-side (all modern browsers) and server-side (Node.js).
