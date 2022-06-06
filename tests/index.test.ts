import { expect, test } from 'vitest'

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

test('decodeOrThrow', () => {
  const decoder = t.object({ a: t.string().array() })

  try {
    decoder.decodeOrThrow({})
    fail()
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Decode Error at path=["a"] message="expected an array, found undefined"]`,
    )
  }

  try {
    decoder.decodeOrThrow({ a: ['foo', 2] })
    fail()
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Decode Error at path=["a",1] message="expected a string, found a number"]`,
    )
  }

  try {
    decoder.decodeOrThrow({ a: () => {} })
    fail()
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
