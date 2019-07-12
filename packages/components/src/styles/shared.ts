import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { mutedOpacity } from './variables'

export const sharedStyles = StyleSheet.create({
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  flexWrap: { flexWrap: 'wrap' },
  flexNoWrap: { flexWrap: 'nowrap' },
  horizontal: { flexDirection: 'row' },
  vertical: { flexDirection: 'column' },
  alignSelfFlexStart: { alignSelf: 'flex-start' },
  alignSelfFlexEnd: { alignSelf: 'flex-end' },
  alignSelfCenter: { alignSelf: 'center' },
  alignSelfStretch: { alignSelf: 'stretch' },
  alignItemsFlexStart: { alignItems: 'flex-start' },
  alignItemsFlexEnd: { alignItems: 'flex-end' },
  alignItemsCenter: { alignItems: 'center' },
  justifyContentFlexStart: { justifyContent: 'flex-start' },
  justifyContentFlexEnd: { justifyContent: 'flex-end' },
  justifyContentCenter: { justifyContent: 'center' },
  justifyContentSpaceBetween: { justifyContent: 'space-between' },
  fullWidth: { width: '100%' },
  fullMaxWidth: { maxWidth: '100%' },
  muted: { opacity: mutedOpacity },
  overflowHidden: { overflow: 'hidden' },

  center: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  horizontalAndVerticallyAligned: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
})
