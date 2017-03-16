import { getMapSubtractedByMap, getObjectDiff } from './helpers';

const mapA = {
  a: {},
  b: {},
  c: undefined,
  d: { d: false },
  e: { e: false },
  f: { f: true },
  g: { g: true },
  h: { h: true, hh: true },
  i: {
    i1: {},
    i2: { '*': { a: false, b: false } },
  },
};

const mapB = {
  a: {},
  b: undefined,
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
};

test('It subtracts a map from another map', () => {
  expect(getMapSubtractedByMap(mapA, mapB)).toEqual({
    b: {},
    e: { e: false },
    f: { f: true },
    h: { hh: true },
    i: {
      i2: { '*': { a: false, b: false } },
    },
  });
});

test('It should get an object diff', () => {
  const obj1 = {
    a: 'a',
    b: 'b',
    c: { c: 'c' },
    d: { d: 'd' },
    e: { e: 'e' },
  };

  const obj2 = {
    a: 'a',
    b: 'b2',
    c: { c: 'c' },
    d: { d: 'dd' },
    e: { ee: 'ee' },
  };

  expect(getObjectDiff(obj1, obj2)).toEqual({
    b: 'b2',
    d: { d: 'dd' },
    e: { e: null, ee: 'ee' },
  });
});
