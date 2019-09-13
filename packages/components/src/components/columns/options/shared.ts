import { StyleSheet } from 'react-native'

import { contentPadding } from '../../../styles/variables'
import { columnHeaderItemContentSize } from '../ColumnHeader'

export const sharedColumnOptionsStyles = StyleSheet.create({
  fullWidthCheckboxContainer: {
    flex: 1,
    alignSelf: 'stretch',
    maxWidth: '100%',
    paddingVertical: contentPadding / 4,
  },

  fullWidthCheckboxContainerWithPadding: {
    flex: 1,
    alignSelf: 'stretch',
    maxWidth: '100%',
    paddingVertical: contentPadding / 4,
    paddingHorizontal: (contentPadding * 2) / 3,
  },

  checkboxSquareContainer: {
    width: columnHeaderItemContentSize,
  },
})
