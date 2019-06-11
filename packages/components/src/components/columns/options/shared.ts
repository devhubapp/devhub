import { StyleSheet } from 'react-native'

import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../../styles/variables'

export const sharedColumnOptionsStyles = StyleSheet.create({
  fullWidthCheckboxContainer: {
    flex: 1,
    alignSelf: 'stretch',
    maxWidth: '100%',
  },

  fullWidthCheckboxContainerWithPadding: {
    flex: 1,
    alignSelf: 'stretch',
    maxWidth: '100%',
    paddingVertical: contentPadding / 4,
    paddingHorizontal: contentPadding,
  },

  checkboxSquareContainer: {
    width: columnHeaderItemContentSize,
  },
})
