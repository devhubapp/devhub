import {
  fixFirebaseKeysFromObject,
  getMapSubtractedByMap,
  getObjectDiff,
  getObjectFilteredByMap,
  getSubMapFromPath,
  transformObjectToDeepPaths,
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
    j1: { jj1: false, '*': { jj: false } },
    j2: { jj2: true, '*': { jj: false } },
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
;(() => {
  const notEncrypted = {
    a: true,
    'b--b': true,
    'c/c': true,
    'd#d#d': true,
    $e$e$e$: true,
    f: {
      'f[f': true,
    },
    g: {
      'g]g': {
        '/g/g/': true,
      },
    },
  }

  const encrypted = {
    a: true,
    'b--b': true,
    c__STRIPE__c: true,
    d__HASH__d__HASH__d: true,
    __DOLLAR__e__DOLLAR__e__DOLLAR__e__DOLLAR__: true,
    f: {
      f__BRACKET_OPEN__f: true,
    },
    g: {
      g__BRACKET_CLOSE__g: {
        __STRIPE__g__STRIPE__g__STRIPE__: true,
      },
    },
  }

  test('It encrypts object keys to Firebase', () => {
    expect(fixFirebaseKeysFromObject(notEncrypted, true)).toEqual(encrypted)
  })

  test('It decrypts object keys from Firebase', () => {
    expect(fixFirebaseKeysFromObject(encrypted, false)).toEqual(notEncrypted)
  })
})()

test('It subtracts a map from another map', () => {
  expect(getMapSubtractedByMap(mapA, mapA)).toEqual(null)
  expect(getMapSubtractedByMap(mapA, mapB)).toEqual({
    b: {},
    e: { e: false },
    f: { f: true },
    h: { hh: true },
    i: {
      i2: { '*': { a: false, b: false } },
    },
    j: {
      j1: { jj1: false, '*': { jj: false } },
      j2: { jj2: true, '*': { jj: false } },
    },
  })
})

test('It filters an object by map', () => {
  const obj = {
    a: 'a',
    b: { bb: { bbb: true } },
    c: { cc: { ccc: true } },
    d: { d: 'd', dd: 'dd' },
    e: { e: 'e', ee: 'eee', eee: 'eee' },
    f: { f: 'f' },
    g: { gg: 'gg' },
    h: { hh: 'hh' },
    i: { i1: { ii: 'ii' }, i2: { ii2: { c: 'c' } }, i3: 'i3' },
    j: {
      j1: { jj1: 'jj1', jjj1: { jj: 'jj', jjj: 'jjj' } },
      j2: { jj2: 'jj2', jjj2: { jj: 'jj', jjj: 'jjj' } },
    },
  }

  expect(getObjectFilteredByMap(obj, mapA)).toEqual({
    a: 'a',
    b: { bb: { bbb: true } },
    // c: { cc: { ccc: true } },
    d: { /* d: 'd',*/ dd: 'dd' },
    e: { /* e: 'e', */ ee: 'eee', eee: 'eee' },
    f: { f: 'f' },
    g: {
      /* gg: 'gg' */
    },
    h: { hh: 'hh' },
    i: { i1: { ii: 'ii' }, i2: { ii2: { c: 'c' } } },
    j: {
      j1: { /* jj1: 'jj1', */ jjj1: { /* jj: 'jj', */ jjj: 'jjj' } },
      j2: { jj2: 'jj2', jjj2: { /* jj: 'jj', */ jjj: 'jjj' } },
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
  expect(getSubMapFromPath(mapA, ['j', 'j1', 'jj1'])).toEqual(false)
})

test('It should transform an object to the firebase update format', () => {
  const obj = {
    a: 10,
    b: 20,
    c: { cc: 30 },
    d: { dd: { ddd: { dddd: 40 } } },
    e: { ee: { eee1: 51, eee2: 52 } },
  }

  expect(transformObjectToDeepPaths(obj)).toEqual({
    a: 10,
    b: 20,
    'c/cc': 30,
    'd/dd/ddd/dddd': 40,
    'e/ee/eee1': 51,
    'e/ee/eee2': 52,
  })

  expect(
    transformObjectToDeepPaths({
      a: {
        'b/c': true,
        b: {
          c: 20,
        },
      },
    }),
  ).toEqual({
    'a/b/c': 20,
    'a/b__STRIPE__c': true,
  })
})
