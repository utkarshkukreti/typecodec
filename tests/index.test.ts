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
