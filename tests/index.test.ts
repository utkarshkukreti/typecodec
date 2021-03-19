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
      "ok": false,
      "value": Object {
        "message": "expected a boolean",
      },
    }
  `)

  expect(decode('foo')).toMatchInlineSnapshot(`
    Object {
      "ok": false,
      "value": Object {
        "message": "expected a boolean",
      },
    }
  `)
})

test('number', () => {
  const decode = t.number().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "ok": false,
      "value": Object {
        "message": "expected a number",
      },
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
      "ok": false,
      "value": Object {
        "message": "expected a number",
      },
    }
  `)
})

test('string', () => {
  const decode = t.string().decode

  expect(decode(false)).toMatchInlineSnapshot(`
    Object {
      "ok": false,
      "value": Object {
        "message": "expected a string",
      },
    }
  `)

  expect(decode(123)).toMatchInlineSnapshot(`
    Object {
      "ok": false,
      "value": Object {
        "message": "expected a string",
      },
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
      "ok": false,
      "value": Object {
        "message": "expected an array",
      },
    }
  `)

  expect(decode({})).toMatchInlineSnapshot(`
    Object {
      "ok": false,
      "value": Object {
        "message": "expected an array",
      },
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
      "ok": false,
      "value": Object {
        "message": "expected a string",
      },
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
