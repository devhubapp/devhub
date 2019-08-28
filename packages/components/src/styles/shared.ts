import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { contentPadding, mutedOpacity } from './variables'

export const sharedStyles = StyleSheet.create({
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
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
  fullHeight: { height: '100%' },
  padding: { padding: contentPadding },
  textCenter: { textAlign: 'center' },
  muted: { opacity: mutedOpacity },
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },

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
