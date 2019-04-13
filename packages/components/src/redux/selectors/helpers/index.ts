import _ from 'lodash'
import { createSelectorCreator, defaultMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  _.isEqual,
)

// TODO: Make a new selector optimized for arrays whose item's refs don't change
export const createArraySelector = createDeepEqualSelector
