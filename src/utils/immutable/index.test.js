import { deepMapKeys, fromJS, toJS } from './';

test('Deep map keys', function fn(immutable = false) {
  const obj = {
    a: 'a',
    b: { bb: 'b' },
    c: { cc: { ccc: 'c' } },
  };

  const mapFn = (value, key) => `${key}_new`;

  const _obj = immutable ? fromJS(obj) : obj;
  const result = toJS(deepMapKeys(_obj, mapFn));

  expect(result).toEqual({
    a_new: 'a',
    b_new: { bb_new: 'b' },
    c_new: { cc_new: { ccc_new: 'c' } },
  });

  if (!immutable) fn(true);
});
