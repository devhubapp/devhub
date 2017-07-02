import { List, Map } from 'immutable'

import {
  createImmutableSelector,
  createImmutableSelectorCreator,
  createObjectKeysMemoized,
  getKeysFromImmutableObject,
  immutableMemoize,
} from './shared'

const objectKeysMemoized = createObjectKeysMemoized()

const obj = Map({
  a: 10,
  b: 20,
  c: 30,
})

test('getKeysFromImmutableObject', () => {
  expect(getKeysFromImmutableObject(obj)).toEqual(List(['a', 'b', 'c']))
})

test('objectKeysMemoized', () => {
  const result1 = objectKeysMemoized(obj)
  const result2 = objectKeysMemoized(obj)
  const result3 = objectKeysMemoized(obj.set('c', 33))

  expect(result1).toEqual(List(['a', 'b', 'c']))
  expect(result1).toBe(result2)
  expect(result1).toBe(result3)
})

test('immutableMemoize -- memoize all arguments', () => {
  const fn = immutableMemoize((a, b, c) => Map({ aa: a, bb: b, cc: c }))

  const result1 = fn(10, 20, 30)
  const result2 = fn(10, 20, 30)
  const result3 = fn(10, 20, 33)

  expect(result1).toEqual(Map({ aa: 10, bb: 20, cc: 30 }))
  expect(result1).toBe(result2)
  expect(result1).not.toBe(result3)
})

test('immutableMemoize -- only check first two arguments', () => {
  const fn = immutableMemoize(
    (a, b, c) => Map({ aa: a, bb: b, cc: c }),
    undefined,
    2,
  )

  const result1 = fn(10, 20, 30)
  const result2 = fn(10, 20, 30)
  const result3 = fn(10, 20, 33)
  const result4 = fn(10, 22, 30)

  expect(result1).toEqual(Map({ aa: 10, bb: 20, cc: 30 }))
  expect(result1).toBe(result2)
  expect(result1).toBe(result3)
  expect(result1).not.toBe(result4)
})

test('immutableMemoize -- check array/List content', () => {
  const fn = immutableMemoize(list => list)

  const result1 = fn(List(['a', 'b', 'c']))
  const result2 = fn(List(['a', 'b', 'c']))

  expect(result1).toEqual(List(['a', 'b', 'c']))
  expect(result1).toBe(result2)
})

test('createImmutableSelector', () => {
  const immutableSelector = createImmutableSelector(
    (state, params) => params.get('a') + 1,
    (state, params) => params.get('b') + 2,
    (state, params) => params.get('c') + 3,
    (a, b, c) => Map({ a, b, c }),
  )

  const result1 = immutableSelector(null, obj)
  const result2 = immutableSelector(null, obj)

  expect(result1).toEqual(Map({ a: 11, b: 22, c: 33 }))
  expect(result1).toBe(result2)
})

test('createImmutableSelectorCreator -- memoize all arguments', () => {
  const _createImmutableSelector1 = createImmutableSelectorCreator()
  const _createImmutableSelector2 = createImmutableSelectorCreator()

  const immutableSelector1 = _createImmutableSelector1(
    (state, params) => params.get('a') + 1,
    (state, params) => params.get('b') + 2,
    (state, params) => params.get('c') + 3,
    (a, b, c) => Map({ a, b, c }),
  )

  const immutableSelector2 = _createImmutableSelector2(
    (state, params) => params.get('a') + 1,
    (state, params) => params.get('b') + 2,
    (state, params) => params.get('c') + 3,
    (a, b, c) => Map({ a, b, c }),
  )

  const result1 = immutableSelector1(null, obj)
  const result2 = immutableSelector1(null, obj)
  const result3 = immutableSelector2(null, obj)

  expect(result1).toEqual(Map({ a: 11, b: 22, c: 33 }))
  expect(result1).toBe(result2)
  expect(result1).not.toBe(result3)
})

test('createImmutableSelectorCreator -- only check two arguments', () => {
  const _createImmutableSelector = createImmutableSelectorCreator(2)

  const immutableSelector = _createImmutableSelector(
    (state, params) => params.get('a') + 1,
    (state, params) => params.get('b') + 2,
    (state, params) => params.get('c') + 3,
    (a, b, c) => Map({ a, b, c }),
  )

  const result1 = immutableSelector(null, Map({ a: 10, b: 20, c: 30 }))
  const result2 = immutableSelector(null, Map({ a: 10, b: 20, c: 33 }))
  const result3 = immutableSelector(null, Map({ a: 10, b: 22, c: 30 }))

  expect(result1).toEqual(Map({ a: 11, b: 22, c: 33 }))
  expect(result1).toBe(result2)
  expect(result1).not.toBe(result3)
})
