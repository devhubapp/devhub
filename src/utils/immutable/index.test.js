import {
  deepMapKeys,
  fromJS,
  mergeDeepInAndRemoveNull,
  removeIn,
  toJS,
} from './'

test('Deep map keys', function fn(immutable = false) {
  const obj = {
    a: 'a',
    b: { bb: 'b' },
    c: { cc: { ccc: 'c' } },
  }

  const mapFn = (value, key) => `${key}_new`

  const _obj = immutable ? fromJS(obj) : obj
  const result = toJS(deepMapKeys(_obj, mapFn))

  expect(result).toEqual({
    a_new: 'a',
    b_new: { bb_new: 'b' },
    c_new: { cc_new: { ccc_new: 'c' } },
  })

  if (!immutable) fn(true)
})

test('Remove item deeply', function fn(immutable = false) {
  const obj = {
    a: true,
    b: { bb: { ccc: true, ddd: true } },
  }

  const _obj = immutable ? fromJS(obj) : obj
  const result = toJS(removeIn(_obj, ['b', 'bb', 'ccc']))

  expect(result).toEqual({
    a: true,
    b: { bb: { ddd: true } },
  })

  if (!immutable) fn(true)
})

test('Merge deep and remove item', function fn(immutable = false) {
  const obj1 = {
    a: true,
    b: { bb: { ccc: true, ddd: true } },
  }

  const b2 = {
    bb: { ccc: null },
    bbb: true,
  }

  const _obj1 = immutable ? fromJS(obj1) : obj1
  const _obj2 = immutable ? fromJS(b2) : b2
  const result = toJS(mergeDeepInAndRemoveNull(_obj1, ['b'], _obj2))

  expect(result).toEqual({
    a: true,
    b: { bb: { ddd: true }, bbb: true },
  })

  if (!immutable) fn(true)
})
