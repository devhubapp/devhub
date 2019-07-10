import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { mutedOpacity } from './variables'

export const sharedStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  flexGrow: {
    flexGrow: 1,
  },

  flexWrap: {
    flexWrap: 'wrap',
  },

  fullWidth: {
    width: '100%',
  },

  center: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  horizontal: {
    flexDirection: 'row',
  },

  horizontalAndVerticallyAligned: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },

  muted: {
    opacity: mutedOpacity,
  },
})
