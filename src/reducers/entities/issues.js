// @flow

import { OrderedMap } from 'immutable';

import type { Normalized } from '../../utils/types';

type State = Normalized<Object>;
export default (state: State = OrderedMap({})): State => state;
