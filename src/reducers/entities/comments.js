// @flow

import { Map } from 'immutable';

import type { Normalized } from '../../utils/types';

type State = Normalized<Object>;
export default (state: State = Map({})): State => state;
