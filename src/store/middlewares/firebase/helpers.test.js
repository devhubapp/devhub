import {
  getMapSubtractedByMap,
  getObjectDiff,
  getSubMapFromPath,
} from './helpers'

const mapA = {
  a: {},
  b: {},
  // c: undefined,
  d: { d: false },
  e: { e: false },
  f: { f: true },
  g: { g: true },
  h: { h: true, hh: true },
  i: {
    i1: {},
    i2: { '*': { a: false, b: false } },
  },
  j: {
    jj: { '*': {}, jjj: false },
  },
}

const mapB = {
  a: {},
  // b: undefined,
  c: {},
  d: { d: false },
  e: { e: true },
  f: { f: false },
  g: { g: true },
  h: { h: true },
  i: {
    i1: {},
    i2: { '*': { c: false, d: false } },
  },
}

test('It subtracts a map from another map', () => {
  expect(getMapSubtractedByMap(mapA, mapB)).toEqual({
    b: {},
    e: { e: false },
    f: { f: true },
    h: { hh: true },
    i: {
      i2: { '*': { a: false, b: false } },
    },
    j: {
      jj: { '*': {}, jjj: false },
    },
  })
})

test('It should get an object diff', () => {
  const obj1 = {
    a: 'a',
    b: 'b',
    c: { c: 'c' },
    d: { d: 'd' },
    e: { e: 'e' },
  }

  const obj2 = {
    a: 'a',
    b: 'b2',
    c: { c: 'c' },
    d: { d: 'dd' },
    e: { ee: 'ee' },
  }

  expect(getObjectDiff(obj1, obj2)).toEqual({
    b: 'b2',
    d: { d: 'dd' },
    e: { e: null, ee: 'ee' },
  })
})

test('It gets a sub map from a path', () => {
  expect(getSubMapFromPath(mapA, [])).toEqual(mapA)
  expect(getSubMapFromPath(mapA, ['b'])).toEqual({})
  expect(getSubMapFromPath(mapA, ['b', 'bb'])).toEqual({})
  expect(getSubMapFromPath(mapA, ['c', 'cc'])).toEqual(undefined)
  expect(getSubMapFromPath(mapA, ['e', 'e'])).toEqual(false)
  expect(getSubMapFromPath(mapA, ['e', 'e', 'e'])).toEqual(false)
  expect(getSubMapFromPath(mapA, ['h', 'h'])).toEqual(true)
  expect(getSubMapFromPath(mapA, ['h', 'h', 'h'])).toEqual(true)
  expect(getSubMapFromPath(mapA, ['i', 'i1', 'i11'])).toEqual({})
  expect(getSubMapFromPath(mapA, ['i', 'i2'])).toEqual(true)
  expect(getSubMapFromPath(mapA, ['i', 'i2', 'xxx'])).toEqual({
    a: false,
    b: false,
  })
  expect(getSubMapFromPath(mapA, ['i', 'i2', 'xxx', 'a'])).toEqual(false)
  expect(getSubMapFromPath(mapA, ['i', 'i2', 'xxx', 'a', 'xxx'])).toEqual(false)
  expect(getSubMapFromPath(mapA, ['i', 'i2', 'xxx', 'c'])).toEqual(true)
  expect(getSubMapFromPath(mapA, ['j', 'jj', 'jjj'])).toEqual(false)
})
