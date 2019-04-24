import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { contentPadding } from '../../../../styles/variables'

export const innerCardSpacing = contentPadding / 3

export const cardRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },

  container__margin: {
    marginTop: contentPadding * (2 / 3),
  },

  mainContentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '100%',
  },
})
