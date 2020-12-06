import { constants, ModalPayloadWithIndex } from '@devhub/core'
import React, { useEffect } from 'react'
import { BackHandler, Dimensions, StyleSheet, View } from 'react-native'
import { useTransition } from '@react-spring/native'

import { SettingsModal } from '../../components/modals/SettingsModal'
import { usePrevious } from '../../hooks/use-previous'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { ColumnSeparator } from '../columns/ColumnSeparator'
import { separatorThickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { DialogProvider } from '../context/DialogContext'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { AddColumnDetailsModal } from './AddColumnDetailsModal'
import { AddColumnModal } from './AddColumnModal'
import { AdvancedSettingsModal } from './AdvancedSettingsModal'
import { EnterpriseSetupModal } from './EnterpriseSetupModal'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { PricingModal } from './PricingModal'
import { SubscribedModal } from './SubscribedModal'
import { SubscribeModal } from './SubscribeModal'

function renderModal(modal: ModalPayloadWithIndex) {
  if (!modal) return null

  switch (modal.name) {
    case 'ADD_COLUMN':
      return (
        <AddColumnModal showBackButton={modal.index >= 1} {...modal.params} />
      )

    case 'ADD_COLUMN_DETAILS':
      return (
        <AddColumnDetailsModal
          showBackButton={modal.index >= 1}
          {...modal.params}
        />
      )

    case 'ADVANCED_SETTINGS':
      return (
        <AdvancedSettingsModal
          showBackButton={modal.index >= 1}
          {...modal.params}
        />
      )

    case 'KEYBOARD_SHORTCUTS':
      return (
        <KeyboardShortcutsModal
          showBackButton={modal.index >= 1}
          {...modal.params}
        />
      )

    case 'PRICING':
      return (
        <PricingModal showBackButton={modal.index >= 1} {...modal.params} />
      )

    case 'SETTINGS':
      return (
        <SettingsModal showBackButton={modal.index >= 1} {...modal.params} />
      )

    case 'SETUP_GITHUB_ENTERPRISE':
      return (
        <EnterpriseSetupModal
          showBackButton={modal.index >= 1}
          {...modal.params}
        />
      )

    case 'SUBSCRIBE':
      return (
        <SubscribeModal showBackButton={modal.index >= 1} {...modal.params} />
      )

    case 'SUBSCRIBED':
      return (
        <SubscribedModal showBackButton={modal.index >= 1} {...modal.params} />
      )

    default:
      return null
  }
}

export interface ModalRendererProps {
  renderSeparator?: boolean
}

export function ModalRenderer(props: ModalRendererProps) {
  const { renderSeparator } = props

  const { appOrientation, sizename } = useAppLayout()
  const columnWidth = useColumnWidth()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const modalStack = useReduxState(selectors.modalStack)
  const previousModalStack = usePrevious(modalStack)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const previouslyOpenedModal = usePrevious(currentOpenedModal)

  const isSettings = !!modalStack.find((m) => m && m.name === 'SETTINGS')
  const wasSettings = usePrevious(isSettings)

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const popModal = useReduxAction(actions.popModal)

  useEffect(() => {
    if (currentOpenedModal && currentOpenedModal.name)
      analytics.trackModalView(currentOpenedModal.name)
  }, [currentOpenedModal && currentOpenedModal.name])

  useEffect(() => {
    if (!(BackHandler && BackHandler.addEventListener)) return

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!!currentOpenedModal) {
          popModal()
          return true
        }
      },
    )

    return () => {
      backHandler.remove()
    }
  }, [!!currentOpenedModal])

  const immediate =
    constants.DISABLE_ANIMATIONS ||
    (sizename <= '2-medium' &&
    ((isSettings && !wasSettings && modalStack.length === 1) ||
      (!currentOpenedModal && wasSettings)) &&
    columnIds.length > 0
      ? true
      : false)

  const size = columnWidth + (renderSeparator ? separatorThickSize : 0)

  const overlayTransition = useTransition(currentOpenedModal, {
    immediate: immediate || sizename <= '2-medium',
    config: getDefaultReactSpringAnimationConfig({ precision: 0.01 }),
    from: { opacity: 0 },
    enter: { opacity: 0.75 },
    leave: { opacity: 0 },
  })

  const modalTransition = useTransition(modalStack, {
    config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
    immediate,
    unique: true,
    keys: (item: ModalPayloadWithIndex | undefined) =>
      `modal-stack-${item?.name}`,
    ...(appOrientation === 'portrait'
      ? {
          from: (item) =>
            (item?.index === 0 && modalStack.length) ||
            (item?.index && !modalStack.length)
              ? {
                  top: immediate ? 0 : Dimensions.get('window').height,
                  left: 0,
                }
              : { top: 0, left: size },
          enter: { top: 0, left: 0 },
          update: (item) =>
            modalStack.length > 1 && item?.index !== modalStack.length - 1
              ? { top: 0, left: -50 }
              : { top: 0, left: 0 },
          leave: (item) =>
            item?.index === 0 || !modalStack.length
              ? { top: Dimensions.get('window').height, left: 0 }
              : { top: 0, left: size },
        }
      : {
          from: (item) =>
            (item?.index === 0 &&
              modalStack.length &&
              !previouslyOpenedModal) ||
            (item?.index && !modalStack.length)
              ? { left: -size }
              : { left: size },
          enter: { left: 0 },
          update: (item) =>
            item?.index !== modalStack.length - 1
              ? { left: -size / 3 }
              : { left: 0 },

          leave: (item) =>
            (item?.index ?? -1) >= modalStack.length &&
            modalStack.length &&
            previouslyOpenedModal &&
            previouslyOpenedModal.name === item?.name &&
            previousModalStack &&
            previousModalStack[0] &&
            previousModalStack[0].name === (modalStack[0] && modalStack[0].name)
              ? { left: size }
              : { left: -size },
        }),
  })

  const separatorTransition = useTransition(
    renderSeparator && sizename !== '2-medium' && modalStack.length
      ? [modalStack[0]?.name]
      : [],
    {
      keys: (name: ModalPayloadWithIndex['name'] | undefined) =>
        `modal-separator-${name}`,
      config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
      immediate,
      unique: true,
      from: { right: size },
      enter: { right: 0 },
      update: { right: 0 },
      leave: { right: size + separatorThickSize },
    },
  )

  return (
    <>
      {overlayTransition(
        ({ opacity }, overlayItem) =>
          !!overlayItem && (
            <SpringAnimatedView
              collapsable={false}
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity,
                  zIndex: 500,
                },
              ]}
            >
              <ThemedTouchableOpacity
                activeOpacity={1}
                backgroundColor="backgroundColorMore1"
                style={[
                  sharedStyles.fullWidth,
                  sharedStyles.fullHeight,
                  Platform.select({ web: { cursor: 'default' } as any }),
                ]}
                onPress={() => closeAllModals()}
                tabIndex={-1}
              />
            </SpringAnimatedView>
          ),
      )}

      {modalTransition(
        (modalAnimatedStyle, modalItem, modalT) =>
          !!modalItem && (
            <View
              key={modalT.key}
              collapsable={false}
              style={[
                sharedStyles.absolute,
                sharedStyles.overflowHidden,
                {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: size,
                  zIndex: 900,
                },
              ]}
            >
              <View
                collapsable={false}
                style={[
                  sharedStyles.flex,
                  sharedStyles.fullHeight,
                  sharedStyles.overflowHidden,
                  {
                    width: columnWidth,
                    zIndex: 900,
                  },
                ]}
              >
                <SpringAnimatedView
                  collapsable={false}
                  style={[
                    sharedStyles.absolute,
                    sharedStyles.horizontal,
                    sharedStyles.overflowHidden,
                    {
                      top: 0,
                      bottom: 0,
                      ...modalAnimatedStyle,
                      zIndex: 900 + modalItem.index,
                    },
                  ]}
                >
                  <DialogProvider>{renderModal(modalItem)}</DialogProvider>
                </SpringAnimatedView>
              </View>

              {separatorTransition(
                (separatorAnimatedStyle, separatorItem, separatorT) =>
                  !!separatorItem && (
                    <SpringAnimatedView
                      key={separatorT.key}
                      collapsable={false}
                      style={[
                        sharedStyles.absolute,
                        {
                          top: 0,
                          bottom: 0,
                        },
                        separatorAnimatedStyle,
                      ]}
                    >
                      <ColumnSeparator />
                    </SpringAnimatedView>
                  ),
              )}
            </View>
          ),
      )}
    </>
  )
}
