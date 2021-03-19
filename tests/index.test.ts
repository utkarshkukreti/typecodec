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
