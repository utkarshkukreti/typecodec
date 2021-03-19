export type Result<T> = { ok: true; value: T } | { ok: false; value: Error }

export type Error = {
  message: string
}

export class Decoder<T> {
  constructor(public decode: (value: unknown) => Result<T>) {}
}

export const boolean = (): Decoder<boolean> =>
  new Decoder(value =>
    typeof value === 'boolean'
      ? { ok: true, value }
      : { ok: false, value: { message: 'expected a boolean' } },
  )
