import React, { useEffect, useRef } from 'react'

import { ModalPayload } from '@devhub/core'
import { NativeComponent, View } from 'react-native'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { findNode, tryFocus } from '../../utils/helpers/shared'
import { Spacer } from '../common/Spacer'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedIconProps } from '../themed/ThemedIcon'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'

export interface ModalColumnProps {
  children: React.ReactNode
  hideCloseButton?: boolean
  icon?: ThemedIconProps['name'] | undefined
  name: ModalPayload['name']
  right?: React.ReactNode
  showBackButton: boolean
  subtitle?: string
  title: string
}

export const ModalColumn = React.memo((props: ModalColumnProps) => {
  const {
    children,
    hideCloseButton,
    icon,
    name,
    right,
    showBackButton,
    subtitle,
    title,
  } = props

  const columnRef = useRef<NativeComponent>(null)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const popModal = useReduxAction(actions.popModal)

  useEffect(() => {
    if (Platform.OS !== 'web') return
    if (!(currentOpenedModal && currentOpenedModal.name === name)) return
    if (!columnRef.current) return

    const node = findNode(columnRef.current)

    if (node && node.focus)
      setTimeout(() => {
        const currentFocusedNodeTag =
          typeof document !== 'undefined' &&
          document &&
          document.activeElement &&
          document.activeElement.tagName
        if (
          currentFocusedNodeTag &&
          currentFocusedNodeTag.toLowerCase() === 'input'
        )
          return

        tryFocus(columnRef.current)
      }, 500)
  }, [currentOpenedModal && currentOpenedModal.name === name])

  return (
    <Column ref={columnRef} columnId={name} style={{ zIndex: 900 }}>
      <ColumnHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        style={[
          { paddingLeft: showBackButton ? contentPadding / 2 : contentPadding },
          !hideCloseButton && { paddingRight: contentPadding / 2 },
        ]}
        left={
          !!showBackButton && (
            <>
              <ColumnHeader.Button
                analyticsLabel="modal"
                analyticsAction="back"
                name="chevron-left"
                onPress={() => popModal()}
                tooltip={`Back (${keyboardShortcutsById.goBack.keys[0]})`}
              />

              <Spacer width={contentPadding / 2} />
            </>
          )
        }
        right={
          <>
            {!hideCloseButton && (
              <ColumnHeader.Button
                analyticsAction="close"
                analyticsLabel="modal"
                name="x"
                onPress={() => closeAllModals()}
                tooltip={
                  showBackButton
                    ? 'Close'
                    : `Close (${keyboardShortcutsById.closeModal.keys[0]})`
                }
              />
            )}

            {right && (
              <View style={sharedStyles.paddingHorizontalHalf}>{right}</View>
            )}
          </>
        }
      />

      {children}
    </Column>
  )
})

ModalColumn.displayName = 'ModalColumn'
