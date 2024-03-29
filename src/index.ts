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

  decodeOr<const U>(value: unknown, or: U): T | U {
    const decoded = this.decode(value)
    return decoded.ok ? decoded.value : or
  }

  map<const U>(fun: (_: T) => U): Decoder<U> {
    return new Decoder(value => {
      const decoded = this.decode(value)
      if (!decoded.ok) return decoded
      return { ok: true, value: fun(decoded.value) }
    })
  }

  filter(
    fun: (_: T) => boolean,
    message: string | ((_: T) => string),
  ): Decoder<T> {
    return new Decoder(value => {
      const decoded = this.decode(value)
      if (!decoded.ok) return decoded
      if (!fun(decoded.value))
        return error(
          [],
          typeof message === 'string' ? message : message(decoded.value),
          value,
        )
      return decoded
    })
  }

  array(): Decoder<T[]> {
    return new Decoder(value => {
      if (!Array.isArray(value)) return expected([], 'an array', value)

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
      : expected([], 'a boolean', value),
  )

export const number = (): Decoder<number> =>
  new Decoder(value =>
    typeof value === 'number'
      ? { ok: true, value }
      : expected([], 'a number', value),
  )

export const string = (): Decoder<string> =>
  new Decoder(value =>
    typeof value === 'string'
      ? { ok: true, value }
      : expected([], 'a string', value),
  )

export const literal = <const T extends boolean | number | string>(
  literal: T,
): Decoder<T> => {
  const message = JSON.stringify(literal)
  return new Decoder(value =>
    value === literal
      ? { ok: true, value: literal }
      : expected([], message, value),
  )
}

export const literals = <const T extends boolean | number | string>(
  literals: readonly T[],
): Decoder<T> => {
  const set: Set<unknown> = new Set(literals)
  const message = `one of [${literals
    .map(literal => JSON.stringify(literal))
    .join(', ')}]`
  return new Decoder(value =>
    set.has(value)
      ? { ok: true, value: value as T }
      : expected([], message, value),
  )
}

const null_ = (): Decoder<null> =>
  new Decoder(value =>
    value === null ? { ok: true, value } : expected([], 'null', value),
  )

export { null_ as null }

const undefined_ = (): Decoder<undefined> =>
  new Decoder(value =>
    value === undefined
      ? { ok: true, value }
      : expected([], 'undefined', value),
  )

export { undefined_ as undefined }

export const unknown = (): Decoder<unknown> =>
  new Decoder(value => ({ ok: true, value }))

export const object = <const T extends Record<string, unknown>>(fields: {
  [K in keyof T]: Decoder<T[K]>
}): Decoder<T> =>
  new Decoder(value => {
    if (value === null || typeof value !== 'object' || Array.isArray(value))
      return expected([], 'an object', value)

    const decoded: Partial<T> = {}

    for (const key in fields) {
      const d = fields[key].decode((value as Record<string, unknown>)[key])
      if (!d.ok) return error([key, ...d.path], d.message, d.value)
      decoded[key] = d.value
    }

    return { ok: true, value: decoded as T }
  })

export const tuple = <
  const T extends readonly [unknown, ...unknown[]] | [],
>(decoders: {
  [K in keyof T]: Decoder<T[K]>
}): Decoder<T> =>
  new Decoder(value => {
    if (!Array.isArray(value)) return expected([], 'an array', value)

    if (value.length !== decoders.length)
      return error(
        [],
        `an array of length ${decoders.length}, found an array of length ${value.length}`,
        value,
      )

    const decoded = []

    for (let i = 0; i < decoders.length; i++) {
      const d = decoders[i]!.decode(value[i])
      if (!d.ok) return error([i, ...d.path], d.message, d.value)
      decoded.push(d.value)
    }

    return {
      ok: true,
      value: decoded as T,
    }
  })

export const stringRecord = <const T>(
  decoder: Decoder<T>,
): Decoder<Record<string, T>> =>
  new Decoder(value => {
    if (value === null || typeof value !== 'object' || Array.isArray(value))
      return expected([], 'an object', value)

    const decoded: Record<string, T> = {}

    for (const key in value) {
      const d = decoder.decode((value as Record<string, unknown>)[key])

      if (!d.ok) return error([key, ...d.path], d.message, d.value)

      decoded[key] = d.value
    }

    return { ok: true, value: decoded }
  })

export const union = <
  const T extends readonly [unknown, ...unknown[]],
>(decoders: {
  [K in keyof T]: Decoder<T[K]>
}): Decoder<T[number]> => {
  return new Decoder(value => {
    for (const decoder of decoders) {
      const d = decoder.decode(value)
      if (d.ok) return d
    }
    return error([], `one of ${decoders.length} decoders`, value)
  })
}

export const at = <T>(path: Path, decoder: Decoder<T>): Decoder<T> =>
  new Decoder(value => {
    for (let i = 0; i < path.length; i++) {
      const keyOrIndex = path[i]!
      if (typeof keyOrIndex === 'number') {
        if (!Array.isArray(value))
          return expected(path.slice(0, i), 'an array', value)
        const value2 = value[keyOrIndex]
        if (value2 === undefined)
          return error(
            path.slice(0, i),
            `an array with index ${keyOrIndex}`,
            value,
          )
        value = value2
      } else {
        if (value === null || typeof value !== 'object')
          return expected(path.slice(0, i), 'an object', value)
        const value2 = (value as Record<string, unknown>)[keyOrIndex]
        if (value2 === undefined)
          return error(
            path.slice(0, i),
            `an object with key ${JSON.stringify(keyOrIndex)}`,
            value,
          )
        value = value2
      }
    }
    const d = decoder.decode(value)
    if (!d.ok) return error([...path, ...d.path], d.message, d.value)
    return d
  })

export const fork = <const T extends [unknown, ...unknown[]]>(decoders: {
  [K in keyof T]: Decoder<T[K]>
}): Decoder<T> =>
  new Decoder(value => {
    const decoded = []

    for (const decoder of decoders) {
      const d = decoder.decode(value)
      if (!d.ok) return d
      decoded.push(d.value)
    }

    return {
      ok: true,
      value: decoded as T,
    }
  })

export const json = <T>(decoder: Decoder<T>): Decoder<T> =>
  new Decoder(value => {
    if (typeof value !== 'string') return expected([], 'a string', value)
    try {
      const parsed: unknown = JSON.parse(value)
      return decoder.decode(parsed)
    } catch (error_) {
      return error([], '' + error_, value)
    }
  })

export const lazy = <T>(fun: () => Decoder<T>): Decoder<T> =>
  new Decoder(value => fun().decode(value))

export const succeed = <const T>(value: T): Decoder<T> =>
  new Decoder(() => ({ ok: true, value }))

export const fail = <T>(message: string): Decoder<T> =>
  new Decoder(value => error([], message, value))

const error = (path: Path, message: string, value: unknown): Error => ({
  ok: false,
  path,
  message,
  value,
})

const expected = (path: Path, expected: string, value: unknown): Error => {
  const type = typeof value
  const found =
    value === null
      ? 'null'
      : value === undefined
        ? 'undefined'
        : type === 'boolean'
          ? 'a boolean'
          : type === 'number'
            ? 'a number'
            : type === 'string'
              ? 'a string'
              : type === 'object'
                ? Array.isArray(value)
                  ? `an array`
                  : `an object`
                : `a ${type}`
  return error(path, `expected ${expected}, found ${found}`, value)
}
