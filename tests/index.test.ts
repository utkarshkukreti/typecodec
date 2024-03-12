import { assert, assertType, expect, test } from 'vitest'

import * as t from '../src'

test('boolean', () => {
  const decode = t.boolean().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    {
      "message": "expected a boolean, found a number",
      "ok": false,
      "path": [],
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected a boolean, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)
})

test('number', () => {
  const decode = t.number().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)
})

test('string', () => {
  const decode = t.string().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected a string, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    {
      "message": "expected a string, found a number",
      "ok": false,
      "path": [],
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": "foo",
    }
  `)
})

test('literal', () => {
  {
    const decoder = t.literal(1)

    assertType<t.Decoder<1>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 1,
      }
    `)

    expect(decoder.decode(2)).toMatchInlineSnapshot(`
      {
        "message": "expected 1, found a number",
        "ok": false,
        "path": [],
        "value": 2,
      }
    `)

    expect(decoder.decode('foo')).toMatchInlineSnapshot(`
      {
        "message": "expected 1, found a string",
        "ok": false,
        "path": [],
        "value": "foo",
      }
    `)
  }

  {
    const decoder = t.literal('foo')

    assertType<t.Decoder<'foo'>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "message": "expected "foo", found a number",
        "ok": false,
        "path": [],
        "value": 1,
      }
    `)

    expect(decoder.decode('foo')).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": "foo",
      }
    `)
  }

  {
    const decoder = t.literal(true)

    assertType<t.Decoder<true>>(decoder)

    expect(decoder.decode(true)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": true,
      }
    `)

    expect(decoder.decode(false)).toMatchInlineSnapshot(`
      {
        "message": "expected true, found a boolean",
        "ok": false,
        "path": [],
        "value": false,
      }
    `)
  }
})

test('literals', () => {
  const decoder = t.literals([1, 'foo'])

  assertType<t.Decoder<1 | 'foo'>>(decoder)

  expect(decoder.decode(1)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 1,
    }
  `)

  expect(decoder.decode(2)).toMatchInlineSnapshot(`
    {
      "message": "expected one of [1, "foo"], found a number",
      "ok": false,
      "path": [],
      "value": 2,
    }
  `)

  expect(decoder.decode('foo')).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": "foo",
    }
  `)

  expect(decoder.decode('bar')).toMatchInlineSnapshot(`
    {
      "message": "expected one of [1, "foo"], found a string",
      "ok": false,
      "path": [],
      "value": "bar",
    }
  `)

  {
    const literals = [1, 'foo'] as const

    const decoder = t.literals(literals)

    assertType<t.Decoder<1 | 'foo'>>(decoder)
  }
})

test('null', () => {
  const decode = t.null().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected null, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode(null)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": null,
    }
  `)
})

test('undefined', () => {
  const decode = t.undefined().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected undefined, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": undefined,
    }
  `)
})

test('unknown', () => {
  const decode = t.unknown().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": false,
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": undefined,
    }
  `)
})

test('array', () => {
  const decode = t.string().array().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found an object",
      "ok": false,
      "path": [],
      "value": {},
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        "foo",
      ],
    }
  `)

  expect(decode(['foo', 1])).toMatchInlineSnapshot(`
    {
      "message": "expected a string, found a number",
      "ok": false,
      "path": [
        1,
      ],
      "value": 1,
    }
  `)

  expect(decode(['foo', 'bar', 'baz', 'quux'])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        "foo",
        "bar",
        "baz",
        "quux",
      ],
    }
  `)
})

test('object', () => {
  const decode = t.object({
    a: t.boolean(),
    b: t
      .object({
        c: t.number(),
      })
      .array(),
  }).decode

  expect(decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected an object, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    {
      "message": "expected an object, found an array",
      "ok": false,
      "path": [],
      "value": [],
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    {
      "message": "expected a boolean, found undefined",
      "ok": false,
      "path": [
        "a",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: 1 })).toMatchInlineSnapshot(`
    {
      "message": "expected a boolean, found a number",
      "ok": false,
      "path": [
        "a",
      ],
      "value": 1,
    }
  `)

  expect(decode({ a: true, b: {} })).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found an object",
      "ok": false,
      "path": [
        "b",
      ],
      "value": {},
    }
  `)

  expect(decode({ a: true, b: [] })).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": {
        "a": true,
        "b": [],
      },
    }
  `)

  expect(decode({ a: true, b: [{}] })).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found undefined",
      "ok": false,
      "path": [
        "b",
        0,
        "c",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: true, b: [{ c: 1 }, {}] })).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found undefined",
      "ok": false,
      "path": [
        "b",
        1,
        "c",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: true, b: [{ c: 1 }, { c: 2 }] })).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": {
        "a": true,
        "b": [
          {
            "c": 1,
          },
          {
            "c": 2,
          },
        ],
      },
    }
  `)
})

test('tuple', () => {
  const decoder = t.tuple([t.boolean(), t.number(), t.string()])

  assertType<t.Decoder<readonly [boolean, number, string]>>(decoder)

  expect(decoder.decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decoder.decode([])).toMatchInlineSnapshot(`
    {
      "message": "an array of length 3, found an array of length 0",
      "ok": false,
      "path": [],
      "value": [],
    }
  `)

  expect(decoder.decode([true])).toMatchInlineSnapshot(`
    {
      "message": "an array of length 3, found an array of length 1",
      "ok": false,
      "path": [],
      "value": [
        true,
      ],
    }
  `)

  expect(decoder.decode([true, 1])).toMatchInlineSnapshot(`
    {
      "message": "an array of length 3, found an array of length 2",
      "ok": false,
      "path": [],
      "value": [
        true,
        1,
      ],
    }
  `)

  expect(decoder.decode([true, 1, 'foo'])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        true,
        1,
        "foo",
      ],
    }
  `)

  expect(decoder.decode([true, 1, 'foo', 'bar'])).toMatchInlineSnapshot(`
    {
      "message": "an array of length 3, found an array of length 4",
      "ok": false,
      "path": [],
      "value": [
        true,
        1,
        "foo",
        "bar",
      ],
    }
  `)

  expect(decoder.decode([true, 'foo', 'bar'])).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [
        1,
      ],
      "value": "foo",
    }
  `)

  expect(t.tuple([]).decode([])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [],
    }
  `)

  expect(t.tuple([]).decode([1])).toMatchInlineSnapshot(`
    {
      "message": "an array of length 0, found an array of length 1",
      "ok": false,
      "path": [],
      "value": [
        1,
      ],
    }
  `)

  {
    const decode = t
      .tuple([t.number(), t.number()])
      .filter(([a, b]) => a == b, 'expected equal numbers').decode

    expect(decode([1, 2])).toMatchInlineSnapshot(`
      {
        "message": "expected equal numbers",
        "ok": false,
        "path": [],
        "value": [
          1,
          2,
        ],
      }
    `)

    expect(decode([2, 2])).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": [
          2,
          2,
        ],
      }
    `)
  }

  {
    const decoders = [t.boolean(), t.number(), t.string()] as const
    const decoder = t.tuple(decoders)
    assertType<t.Decoder<readonly [boolean, number, string]>>(decoder)
  }
})

test('stringRecord', () => {
  const decoder = t.stringRecord(t.number())

  assertType<t.Decoder<Record<string, number>>>(decoder)

  expect(decoder.decode(false)).toMatchInlineSnapshot(`
    {
      "message": "expected an object, found a boolean",
      "ok": false,
      "path": [],
      "value": false,
    }
  `)

  expect(decoder.decode({})).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": {},
    }
  `)

  expect(decoder.decode({ foo: 1 })).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": {
        "foo": 1,
      },
    }
  `)

  expect(decoder.decode({ foo: 1, bar: 2 })).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": {
        "bar": 2,
        "foo": 1,
      },
    }
  `)

  expect(decoder.decode({ foo: 1, bar: '2' })).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [
        "bar",
      ],
      "value": "2",
    }
  `)
})

test('union', () => {
  {
    const decoder = t.union([t.number(), t.string()])

    assertType<t.Decoder<string | number>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 1,
      }
    `)

    expect(decoder.decode('foo')).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": "foo",
      }
    `)

    expect(decoder.decode(true)).toMatchInlineSnapshot(`
      {
        "message": "one of 2 decoders",
        "ok": false,
        "path": [],
        "value": true,
      }
    `)
  }

  {
    const decoder = t.union([t.literal(1), t.literal(true)])

    assertType<t.Decoder<1 | true>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 1,
      }
    `)

    expect(decoder.decode('foo')).toMatchInlineSnapshot(`
      {
        "message": "one of 2 decoders",
        "ok": false,
        "path": [],
        "value": "foo",
      }
    `)

    expect(decoder.decode(true)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": true,
      }
    `)
  }
})

test('at', () => {
  {
    const decoder = t.at(['foo'], t.string())

    assertType<t.Decoder<string>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "message": "expected an object, found a number",
        "ok": false,
        "path": [],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: 1 })).toMatchInlineSnapshot(`
      {
        "message": "expected a string, found a number",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: 'bar' })).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": "bar",
      }
    `)
  }

  {
    const decoder = t.at(['foo', 0, 'bar'], t.string())

    assertType<t.Decoder<string>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "message": "expected an object, found a number",
        "ok": false,
        "path": [],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: 1 })).toMatchInlineSnapshot(`
      {
        "message": "expected an array, found a number",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: [] })).toMatchInlineSnapshot(`
      {
        "message": "an array with index 0",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": [],
      }
    `)

    expect(decoder.decode({ foo: [{ bar: 2 }] })).toMatchInlineSnapshot(`
      {
        "message": "expected a string, found a number",
        "ok": false,
        "path": [
          "foo",
          0,
          "bar",
        ],
        "value": 2,
      }
    `)

    expect(decoder.decode({ foo: [{ bar: 'baz' }] })).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": "baz",
      }
    `)

    expect(decoder.decode({ foo: { 0: { bar: 'baz' } } }))
      .toMatchInlineSnapshot(`
      {
        "message": "expected an array, found an object",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": {
          "0": {
            "bar": "baz",
          },
        },
      }
    `)
  }
})

test('fork', () => {
  {
    const decoder = t.fork([t.at(['foo'], t.string())])

    assertType<t.Decoder<[string]>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "message": "expected an object, found a number",
        "ok": false,
        "path": [],
        "value": 1,
      }
    `)

    expect(decoder.decode({})).toMatchInlineSnapshot(`
      {
        "message": "an object with key "foo"",
        "ok": false,
        "path": [],
        "value": {},
      }
    `)

    expect(decoder.decode({ foo: 1 })).toMatchInlineSnapshot(`
      {
        "message": "expected a string, found a number",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: 'foo' })).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": [
          "foo",
        ],
      }
    `)
  }

  {
    const decoder = t.fork([
      t.at(['foo'], t.string()),
      t.at(['bar', 0], t.literal(0)),
    ])

    assertType<t.Decoder<[string, 0]>>(decoder)

    expect(decoder.decode(1)).toMatchInlineSnapshot(`
      {
        "message": "expected an object, found a number",
        "ok": false,
        "path": [],
        "value": 1,
      }
    `)

    expect(decoder.decode({})).toMatchInlineSnapshot(`
      {
        "message": "an object with key "foo"",
        "ok": false,
        "path": [],
        "value": {},
      }
    `)

    expect(decoder.decode({ foo: 'foo' })).toMatchInlineSnapshot(`
      {
        "message": "an object with key "bar"",
        "ok": false,
        "path": [],
        "value": {
          "foo": "foo",
        },
      }
    `)

    expect(decoder.decode({ foo: 'foo', bar: 'bar' })).toMatchInlineSnapshot(`
      {
        "message": "expected an array, found a string",
        "ok": false,
        "path": [
          "bar",
        ],
        "value": "bar",
      }
    `)

    expect(decoder.decode({ foo: 'foo', bar: [0] })).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": [
          "foo",
          0,
        ],
      }
    `)

    expect(decoder.decode({ foo: 'foo', bar: [1] })).toMatchInlineSnapshot(`
      {
        "message": "expected 0, found a number",
        "ok": false,
        "path": [
          "bar",
          0,
        ],
        "value": 1,
      }
    `)

    expect(decoder.decode({ foo: 'foo', bar: [0, 1, 2] }))
      .toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": [
          "foo",
          0,
        ],
      }
    `)
  }
})

test('json', () => {
  {
    const decode = t.json(t.string()).decode

    expect(decode('foo').ok).toEqual(false)

    expect(decode('"foo"')).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": "foo",
      }
    `)
  }

  {
    const decode = t.json(t.object({ foo: t.number() })).decode

    expect(decode('{}')).toMatchInlineSnapshot(`
      {
        "message": "expected a number, found undefined",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": undefined,
      }
    `)

    expect(decode('{"foo": "bar"}')).toMatchInlineSnapshot(`
      {
        "message": "expected a number, found a string",
        "ok": false,
        "path": [
          "foo",
        ],
        "value": "bar",
      }
    `)

    expect(decode('{"foo": 123}')).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": {
          "foo": 123,
        },
      }
    `)
  }
})

test('lazy', () => {
  type T = number | T[]

  const decoder: t.Decoder<T> = t.union([
    t.number(),
    t.lazy(() => decoder).array(),
  ])

  const decode = decoder.decode

  expect(decode(1)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 1,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [],
    }
  `)

  expect(decode([1])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        1,
      ],
    }
  `)

  expect(decode([1, 2])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        1,
        2,
      ],
    }
  `)

  expect(decode([1, 2, [[[3]]]])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        1,
        2,
        [
          [
            [
              3,
            ],
          ],
        ],
      ],
    }
  `)

  expect(decode([1, 2, [[[3]]], 4])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        1,
        2,
        [
          [
            [
              3,
            ],
          ],
        ],
        4,
      ],
    }
  `)

  expect(decode([1, 2, [[[3, '4']]]])).toMatchInlineSnapshot(`
    {
      "message": "one of 2 decoders",
      "ok": false,
      "path": [],
      "value": [
        1,
        2,
        [
          [
            [
              3,
              "4",
            ],
          ],
        ],
      ],
    }
  `)

  expect(decode([1, 2, [[[3]], '4']])).toMatchInlineSnapshot(`
    {
      "message": "one of 2 decoders",
      "ok": false,
      "path": [],
      "value": [
        1,
        2,
        [
          [
            [
              3,
            ],
          ],
          "4",
        ],
      ],
    }
  `)

  expect(decode([1, 2, [[[3]]], '4'])).toMatchInlineSnapshot(`
    {
      "message": "one of 2 decoders",
      "ok": false,
      "path": [],
      "value": [
        1,
        2,
        [
          [
            [
              3,
            ],
          ],
        ],
        "4",
      ],
    }
  `)
})

test('succeed', () => {
  const decoder = t.succeed(123)

  assertType<t.Decoder<123>>(decoder)

  expect(decoder.decode('foo')).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 123,
    }
  `)

  expect(decoder.decode(123)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 123,
    }
  `)
})

test('fail', () => {
  const decoder = t.fail('message')

  assertType<t.Decoder<unknown>>(decoder)

  expect(decoder.decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "message",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)

  expect(decoder.decode(123)).toMatchInlineSnapshot(`
    {
      "message": "message",
      "ok": false,
      "path": [],
      "value": 123,
    }
  `)
})

test('optional', () => {
  const decode = t.string().array().optional().decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": undefined,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        "foo",
      ],
    }
  `)

  {
    const decode = t.number().optional(-1).decode

    expect(decode(null)).toMatchInlineSnapshot(`
      {
        "message": "expected a number, found null",
        "ok": false,
        "path": [],
        "value": null,
      }
    `)

    expect(decode(undefined)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(123)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 123,
      }
    `)
  }
})

test('nullable', () => {
  const decode = t.string().array().nullable().decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    {
      "message": "expected an array, found undefined",
      "ok": false,
      "path": [],
      "value": undefined,
    }
  `)

  expect(decode(null)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": null,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": [
        "foo",
      ],
    }
  `)

  {
    const decode = t.number().nullable(-1).decode

    expect(decode(null)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(undefined)).toMatchInlineSnapshot(`
      {
        "message": "expected a number, found undefined",
        "ok": false,
        "path": [],
        "value": undefined,
      }
    `)

    expect(decode(null)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(123)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 123,
      }
    `)
  }
})

test('map', () => {
  const decode = t.number().map(number => number.toString()).decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)

  expect(decode('123')).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [],
      "value": "123",
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": "123",
    }
  `)
})

test('filter', () => {
  const decode = t
    .number()
    .filter(
      number => number >= 0 && number <= 10,
      'expected number to be between 0 and 10',
    ).decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    {
      "message": "expected a number, found a string",
      "ok": false,
      "path": [],
      "value": "foo",
    }
  `)

  expect(decode(-5)).toMatchInlineSnapshot(`
    {
      "message": "expected number to be between 0 and 10",
      "ok": false,
      "path": [],
      "value": -5,
    }
  `)

  expect(decode(5)).toMatchInlineSnapshot(`
    {
      "ok": true,
      "value": 5,
    }
  `)

  {
    const decode = t.number().filter(
      number => number >= 0 && number <= 10,
      number => `expected a number between 0 and 10, found ${number}`,
    ).decode

    expect(decode('foo')).toMatchInlineSnapshot(`
      {
        "message": "expected a number, found a string",
        "ok": false,
        "path": [],
        "value": "foo",
      }
    `)

    expect(decode(-5)).toMatchInlineSnapshot(`
      {
        "message": "expected a number between 0 and 10, found -5",
        "ok": false,
        "path": [],
        "value": -5,
      }
    `)

    expect(decode(5)).toMatchInlineSnapshot(`
      {
        "ok": true,
        "value": 5,
      }
    `)
  }
})

test('decodeOrThrow', () => {
  const decoder = t.object({ a: t.string().array() })

  try {
    decoder.decodeOrThrow({})
    assert(false)
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Decode Error at path=["a"] message="expected an array, found undefined"]`,
    )
  }

  try {
    decoder.decodeOrThrow({ a: ['foo', 2] })
    assert(false)
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Decode Error at path=["a",1] message="expected a string, found a number"]`,
    )
  }

  try {
    decoder.decodeOrThrow({ a: () => {} })
    assert(false)
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Decode Error at path=["a"] message="expected an array, found a function"]`,
    )
  }

  expect(decoder.decodeOrThrow({ a: ['foo'] })).toMatchInlineSnapshot(`
    {
      "a": [
        "foo",
      ],
    }
  `)
})

test('decodeOr', () => {
  const decoder = t.object({ a: t.string() })

  const value1 = decoder.decodeOr({}, null)
  assertType<{ a: string } | null>(value1)
  expect(value1).toMatchInlineSnapshot('null')

  const value2 = decoder.decodeOr({}, { a: 1 })
  assertType<{ a: string | number }>(value2)
  expect(value2).toMatchInlineSnapshot(`
    {
      "a": 1,
    }
  `)
})
