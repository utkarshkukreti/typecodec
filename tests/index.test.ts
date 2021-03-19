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
      "message": "expected a boolean",
      "ok": false,
      "path": Array [],
      "value": 123,
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean",
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
      "message": "expected a number",
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
      "message": "expected a number",
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
      "message": "expected a string",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
      "message": "expected a string",
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

test('array', () => {
  const decode = t.string().array().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array",
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
      "message": "expected a string",
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
      "message": "expected an object",
      "ok": false,
      "path": Array [],
      "value": false,
    }
  `)

  expect(decode([])).toMatchInlineSnapshot(`
    Object {
      "message": "expected an object",
      "ok": false,
      "path": Array [],
      "value": Array [],
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean",
      "ok": false,
      "path": Array [
        "a",
      ],
      "value": undefined,
    }
  `)

  expect(decode({ a: 1 })).toMatchInlineSnapshot(`
    Object {
      "message": "expected a boolean",
      "ok": false,
      "path": Array [
        "a",
      ],
      "value": 1,
    }
  `)

  expect(decode({ a: true, b: {} })).toMatchInlineSnapshot(`
    Object {
      "message": "expected an array",
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
      "message": "expected a number",
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
      "message": "expected a number",
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
      "message": "expected an array",
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
})
