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

export type Infer<T> = T extends Decoder<infer U> ? U : never

export class Decoder<T> {
  constructor(public decode: (value: unknown) => Result<T>) {}

  decodeOrThrow(value: unknown): T {
    const decoded = this.decode(value)
    if (!decoded.ok)
      throw new Error(
        `Decode Error at path=${JSON.stringify(
          decoded.path,
        )} message=${JSON.stringify(decoded.message)}`,
      )
    return decoded.value
  }

  map<U>(fun: (_: T) => U): Decoder<U> {
    return new Decoder(value => {
      const decoded = this.decode(value)
      if (!decoded.ok) return decoded
      return { ok: true, value: fun(decoded.value) }
    })
  }

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

  optional(): Decoder<T | undefined>
  optional(defaultValue: T): Decoder<T>
  optional(defaultValue?: T): Decoder<T | undefined> {
    return new Decoder<T | undefined>(value =>
      value === undefined
        ? { ok: true, value: defaultValue ?? undefined }
        : this.decode(value),
    )
  }

  nullable(): Decoder<T | null>
  nullable(defaultValue: T): Decoder<T>
  nullable(defaultValue?: T): Decoder<T | null> {
    return new Decoder<T | null>(value =>
      value === null
        ? { ok: true, value: defaultValue ?? null }
        : this.decode(value),
    )
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

const null_ = (): Decoder<null> =>
  new Decoder(value =>
    value === null ? { ok: true, value } : error([], 'expected null', value),
  )

export { null_ as null }

const undefined_ = (): Decoder<undefined> =>
  new Decoder(value =>
    value === undefined
      ? { ok: true, value }
      : error([], 'expected undefined', value),
  )

export { undefined_ as undefined }

export const unknown = (): Decoder<unknown> =>
  new Decoder(value => ({ ok: true, value }))

export const object = <T extends Record<string, unknown>>(
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
