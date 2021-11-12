import * as t from '../src'

test('boolean', () => {
  const decode = t.boolean().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean, found a number",
      "ok": false,
      "path": Array [],
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean, found a string",
      "ok": false,
      "path": Array [],
      "value": "foo",
    }
  `)
})

test('number', () => {
  const decode = t.number().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found a string",
      "ok": false,
      "path": Array [],
      "value": "foo",
    }
  `)
})

test('string', () => {
  const decode = t.string().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected a string, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
      "message": "expected a string, found a number",
      "ok": false,
      "path": Array [],
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": "foo",
    }
  `)
})

test('null', () => {
  const decode = t.null().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected null, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode(null)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": null,
    }
  `)
})

test('undefined', () => {
  const decode = t.undefined().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected undefined, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": undefined,
    }
  `)
})

test('unknown', () => {
  const decode = t.unknown().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": false,
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": undefined,
    }
  `)
})

test('array', () => {
  const decode = t.string().array().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array, found an object",
      "ok": false,
      "path": Array [],
      "value": Object {},
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [
        "foo",
      ],
    }
  `)

  expect(decode(['foo', 1])).toMatchInlineSnapshot(`
    Object {
      "message": "expected a string, found a number",
      "ok": false,
      "path": Array [
        1,
      ],
      "value": 1,
    }
  `)

  expect(decode(['foo', 'bar', 'baz', 'quux'])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [
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
    Object {
      "message": "expected an object, found a boolean",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    Object {
      "message": "expected an object, found an array",
      "ok": false,
      "path": Array [],
      "value": Array [],
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean, found undefined",
      "ok": false,
      "path": Array [
        "a",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: 1 })).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean, found a number",
      "ok": false,
      "path": Array [
        "a",
      ],
      "value": 1,
    }
  `)

  expect(decode({ a: true, b: {} })).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array, found an object",
      "ok": false,
      "path": Array [
        "b",
      ],
      "value": Object {},
    }
  `)

  expect(decode({ a: true, b: [] })).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Object {
        "a": true,
        "b": Array [],
      },
    }
  `)

  expect(decode({ a: true, b: [{}] })).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found undefined",
      "ok": false,
      "path": Array [
        "b",
        0,
        "c",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: true, b: [{ c: 1 }, {}] })).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found undefined",
      "ok": false,
      "path": Array [
        "b",
        1,
        "c",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: true, b: [{ c: 1 }, { c: 2 }] })).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Object {
        "a": true,
        "b": Array [
          Object {
            "c": 1,
          },
          Object {
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
    Object {
      "message": "expected an array, found a string",
      "ok": false,
      "path": Array [],
      "value": "foo",
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": undefined,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [
        "foo",
      ],
    }
  `)

  {
    const decode = t.number().optional(-1).decode

    expect(decode(null)).toMatchInlineSnapshot(`
      Object {
        "message": "expected a number, found null",
        "ok": false,
        "path": Array [],
        "value": null,
      }
    `)

    expect(decode(undefined)).toMatchInlineSnapshot(`
      Object {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(123)).toMatchInlineSnapshot(`
      Object {
        "ok": true,
        "value": 123,
      }
    `)
  }
})

test('nullable', () => {
  const decode = t.string().array().nullable().decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array, found a string",
      "ok": false,
      "path": Array [],
      "value": "foo",
    }
  `)

  expect(decode(undefined)).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array, found undefined",
      "ok": false,
      "path": Array [],
      "value": undefined,
    }
  `)

  expect(decode(null)).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": null,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [],
    }
  `)

  expect(decode(['foo'])).toMatchInlineSnapshot(`
    Object {
      "ok": true,
      "value": Array [
        "foo",
      ],
    }
  `)

  {
    const decode = t.number().nullable(-1).decode

    expect(decode(null)).toMatchInlineSnapshot(`
      Object {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(undefined)).toMatchInlineSnapshot(`
      Object {
        "message": "expected a number, found undefined",
        "ok": false,
        "path": Array [],
        "value": undefined,
      }
    `)

    expect(decode(null)).toMatchInlineSnapshot(`
      Object {
        "ok": true,
        "value": -1,
      }
    `)

    expect(decode(123)).toMatchInlineSnapshot(`
      Object {
        "ok": true,
        "value": 123,
      }
    `)
  }
})

test('map', () => {
  const decode = t.number().map(number => number.toString()).decode

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found a string",
      "ok": false,
      "path": Array [],
      "value": "foo",
    }
  `)

  expect(decode('123')).toMatchInlineSnapshot(`
    Object {
      "message": "expected a number, found a string",
      "ok": false,
      "path": Array [],
      "value": "123",
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
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
    Object {
      "a": Array [
        "foo",
      ],
    }
  `)
})
