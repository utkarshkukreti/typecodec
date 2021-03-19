export type Result<T> = { ok: true; value: T } | { ok: false; value: Error }

export type Error = {
  message: string
}

export class Decoder<T> {
  constructor(public decode: (value: unknown) => Result<T>) {}

  array(): Decoder<T[]> {
    return new Decoder(value => {
      if (!Array.isArray(value))
        return { ok: false, value: { message: 'expected an array' } }

      const decoded = []

      for (let i = 0; i < value.length; i++) {
        const d = this.decode(value[i])
        if (!d.ok) return d
        decoded.push(d.value)
      }

      return { ok: true, value: decoded }
    })
  }
}

export const boolean = (): Decoder<boolean> =>
  new Decoder(value =>
    typeof value === 'boolean'
      ? { ok: true, value }
      : { ok: false, value: { message: 'expected a boolean' } },
  )

export const number = (): Decoder<number> =>
  new Decoder(value =>
    typeof value === 'number'
      ? { ok: true, value }
      : { ok: false, value: { message: 'expected a number' } },
  )

export const string = (): Decoder<string> =>
  new Decoder(value =>
    typeof value === 'string'
      ? { ok: true, value }
      : { ok: false, value: { message: 'expected a string' } },
  )

export const object = <T>(
  fields: { [K in keyof T]: Decoder<T[K]> },
): Decoder<T> =>
  new Decoder(value => {
    if (Object.prototype.toString.call(value) !== '[object Object]')
      return { ok: false, value: { message: 'expected an object' } }

    const valueAsRecord = value as Record<string, unknown>

    const decoded: Partial<T> = {}

    for (const key in fields) {
      const d = fields[key].decode(valueAsRecord[key])
      if (!d.ok) return d
      decoded[key] = d.value
    }

    return { ok: true, value: decoded as T }
  })
