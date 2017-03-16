import { getMapSubtractedByMap } from './helpers';

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
