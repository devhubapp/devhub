import React from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'

import { ModalPayload, ModalPayloadWithIndex } from '@devhub/core'
import { animated, config, useTransition } from 'react-spring/hooks'
import { SettingsModal } from '../../components/modals/SettingsModal'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { Separator, separatorTickSize } from '../common/Separator'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { AddColumnDetailsModal } from './AddColumnDetailsModal'
import { AddColumnModal } from './AddColumnModal'
import { EnterpriseSetupModal } from './EnterpriseSetupModal'

const AnimatedView = animated(Animated.View)

function renderModal(modal: ModalPayload) {
  if (!modal) return null

  analytics.trackModalView(modal.name)

  switch (modal.name) {
    case 'ADD_COLUMN':
      return <AddColumnModal />

    case 'ADD_COLUMN_DETAILS':
      return <AddColumnDetailsModal {...modal.params} />

    case 'SETTINGS':
      return <SettingsModal />

    case 'SETUP_GITHUB_ENTERPRISE':
      return <EnterpriseSetupModal />

    default:
      return null
  }
}

export interface ModalRendererProps {
  renderSeparator?: boolean
}

export function ModalRenderer(props: ModalRendererProps) {
  const { renderSeparator } = props

  const { sizename } = useAppLayout()
  const animatedTheme = useAnimatedTheme()
  const columnWidth = useColumnWidth()

  const modalStack = useReduxState(selectors.modalStack)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  const closeAllModals = useReduxAction(actions.closeAllModals)

  const size = columnWidth + (renderSeparator ? separatorTickSize : 0)

  const overlayTransition = useTransition<boolean, any>({
    native: true,
    reset: true,
    unique: true,
    items: currentOpenedModal ? [true] : [],
    keys: () => 'modal-opacity-overlay',
    config: { ...config.default, duration: 200, precision: 0.01 },
    from: { opacity: 0 },
    enter: { opacity: 0.75 },
    leave: { opacity: 0 },
  })[0]

  const modalTransitions = useTransition<ModalPayloadWithIndex, any>({
    native: true,
    reset: true,
    unique: false,
    items: modalStack,
    keys: item => `modal-stack-${item.name}`,
    ...(sizename === '1-small'
      ? {
          from: item =>
            (item.index === 0 && modalStack.length) ||
            (item.index > 0 && !modalStack.length)
              ? { top: Dimensions.get('window').height }
              : { top: 0 },
          enter: { top: 0 },
          update: { top: 0 },
          leave: item =>
            item.index === 0 || !modalStack.length
              ? { top: Dimensions.get('window').height }
              : { top: 0 },
        }
      : {
          from: item =>
            (item.index === 0 && modalStack.length) ||
            (item.index > 0 && !modalStack.length)
              ? { marginLeft: -size }
              : { marginLeft: 0 },
          enter: { marginLeft: 0 },
          update: { marginLeft: 0 },
          leave: item =>
            item.index === 0 || !modalStack.length
              ? { marginLeft: -size }
              : { marginLeft: 0 },
        }),
  })

  return (
    <>
      {!!overlayTransition && (
        <TouchableOpacity
          analyticsAction="close-via-overlay"
          analyticsLabel="modal"
          activeOpacity={1}
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 500 },
            Platform.OS === 'web' && ({ cursor: 'default' } as any),
          ]}
          onPress={() => closeAllModals()}
        >
          <AnimatedView
            style={StyleSheet.flatten([
              StyleSheet.absoluteFill,
              overlayTransition.props,
              { backgroundColor: animatedTheme.backgroundColor, zIndex: 500 },
            ])}
          />
        </TouchableOpacity>
      )}

      {modalTransitions.map(
        ({ key, item, props: { width, ...animatedStyle } }) => (
          <AnimatedView
            key={key}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              flexDirection: 'row',
              ...animatedStyle,
              overflow: 'hidden',
              zIndex: 900 + item.index,
            }}
          >
            {renderModal(item)}
            {!!renderSeparator && item.index === 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 1000,
                }}
              >
                <Separator thick zIndex={1000} />
              </View>
            )}
          </AnimatedView>
        ),
      )}
    </>
  )
}
