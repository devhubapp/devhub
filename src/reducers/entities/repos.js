// @flow

import { Map } from 'immutable';

import type { Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState): State => state;
