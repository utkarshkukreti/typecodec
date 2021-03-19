export type Result<T> = { ok: true; value: T } | { ok: false; value: Error }

export type Error = {
  message: string
}

export class Decoder<T> {
  constructor(public decode: (value: unknown) => Result<T>) {}
}

export const sum = (a: number, b: number) => a + b
