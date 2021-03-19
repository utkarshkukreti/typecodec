export type Result<T> = Ok<T> | Error

export type Ok<T> = {
  ok: true
  value: T
}

export type Path = (number | string)[]

export type Error = {
  ok: false
  path: Path
  message: string
  value: unknown
}

export class Decoder<T> {
  constructor(public decode: (value: unknown) => Result<T>) {}

  array(): Decoder<T[]> {
    return new Decoder<T[]>(value => {
      if (!Array.isArray(value)) return error([], 'expected an array', value)

      const decoded = []

      for (let i = 0; i < value.length; i++) {
        const d = this.decode(value[i])
        if (!d.ok) return error([i, ...d.path], d.message, d.value)
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
      : error([], 'expected a boolean', value),
  )

export const number = (): Decoder<number> =>
  new Decoder(value =>
    typeof value === 'number'
      ? { ok: true, value }
      : error([], 'expected a number', value),
  )

export const string = (): Decoder<string> =>
  new Decoder(value =>
    typeof value === 'string'
      ? { ok: true, value }
      : error([], 'expected a string', value),
  )

export const object = <T>(
  fields: { [K in keyof T]: Decoder<T[K]> },
): Decoder<T> =>
  new Decoder<T>(value => {
    if (Object.prototype.toString.call(value) !== '[object Object]')
      return error([], 'expected an object', value)

    const valueAsRecord = value as Record<string, unknown>

    const decoded: Partial<T> = {}

    for (const key in fields) {
      const d = fields[key].decode(valueAsRecord[key])
      if (!d.ok) return error([key, ...d.path], d.message, d.value)
      decoded[key] = d.value
    }

    return { ok: true, value: decoded as T }
  })

const error = (path: Path, message: string, value: unknown): Error => ({
  ok: false,
  path,
  message,
  value,
})
