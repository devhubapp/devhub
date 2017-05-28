import {
  deepMapKeys,
  fromJS,
  get,
  getIn,
  mergeDeepIn,
  removeIn,
  set,
  setIn,
  toJS,
} from './'

test('Get', function fn(immutable = false) {
  const obj = {
    a: 10,
    b: 20,
    c: 30,
  }

  const _obj = immutable ? fromJS(obj) : obj
  expect(get(_obj, 'b')).toEqual(20)

  if (!immutable) fn(true)
})

test('Set', function fn(immutable = false) {
  const objA = {
    a: 10,
    b: 20,
    c: 30,
  }
  const objB = {
    a: 10,
    b: 42,
    c: 30,
  }

  const _objA = immutable ? fromJS(objA) : objA
  const _objB = immutable ? fromJS(objB) : objB
  expect(set(_objA, 'b', 42)).toEqual(_objB)

  if (!immutable) fn(true)
})

test('Get in', function fn(immutable = false) {
  const obj = {
    a: { aa: { aaa: 42 } },
  }

  const _obj = immutable ? fromJS(obj) : obj
  expect(getIn(_obj, ['a', 'aa', 'aaa'])).toEqual(42)

  if (!immutable) fn(true)
})

test('Set in', function fn(immutable = false) {
  const objA = {
    a: { aa: { aaa: 42 } },
  }

  const objB = {
    a: { aa: { aaa: 99 } },
  }

  const _objA = immutable ? fromJS(objA) : objA
  const _objB = immutable ? fromJS(objB) : objB
  expect(setIn(_objA, ['a', 'aa', 'aaa'], 99)).toEqual(_objB)

  if (!immutable) fn(true)
})

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
  const b1 = { bb: { ccc: true, ddd: true } }
  const b2 = { bb: { ccc: null }, bbb: true }

  const obj1 = { a1: true, b1 }

  const _obj1 = immutable ? fromJS(obj1) : obj1
  const _b2 = immutable ? fromJS(b2) : b2
  const result = toJS(mergeDeepIn(_obj1, ['b1'], _b2, true))

  expect(result).toEqual({
    a1: true,
    b1: { bb: { ddd: true }, bbb: true },
  })

  if (!immutable) fn(true)
})
