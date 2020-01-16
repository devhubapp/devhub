import { Theme, ThemeColors } from '@devhub/core'
import React, { ReactNode, useEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import url from 'url'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useEmitter } from '../../hooks/use-emitter'
import { useIsColumnFocused } from '../../hooks/use-is-column-focused'
import { useLastInputType } from '../../hooks/use-last-input-type'
import { ErrorBoundary, ErrorBoundaryProps } from '../../libs/bugsnag'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { GenericMessageWithButtonView } from '../cards/GenericMessageWithButtonView'
import { ButtonLink } from '../common/ButtonLink'
import { separatorThickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { DialogProvider } from '../context/DialogContext'
import { ThemedView } from '../themed/ThemedView'
import { ColumnSeparator } from './ColumnSeparator'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string | undefined)
  children?: ReactNode
  columnId: string
  pagingEnabled?: boolean
  renderLeftSeparator?: boolean
  renderRightSeparator?: boolean
  style?: StyleProp<ViewStyle>
}

export const CurrentColumnContext = React.createContext<string | undefined>(
  undefined,
)

export const Column = React.memo(
  React.forwardRef((props: ColumnProps, ref) => {
    const {
      backgroundColor = 'backgroundColor',
      children,
      columnId,
      pagingEnabled,
      renderLeftSeparator,
      renderRightSeparator,
      style,
      ...otherProps
    } = props

    const _columnRef = useRef<View>(null)
    const columnRef = (ref as React.RefObject<View>) || _columnRef

    const columnBorderRef = useRef<View | null>(null)
    const columnWidth = useColumnWidth()
    const isColumnFocused = useIsColumnFocused(columnId)
    const lastUsedInputType = useLastInputType()
    const { appViewMode } = useAppViewMode()

    useEffect(() => {
      return () => {
        columnBorderRef.current = null
      }
    }, [])

    useEmitter('FOCUS_ON_COLUMN', payload => {
      if (!columnBorderRef.current) return

      if (!(payload.columnId && payload.columnId === columnId)) {
        columnBorderRef.current.setNativeProps({ style: { opacity: 0 } })
        return
      }

      if (payload.highlight) {
        columnBorderRef.current.setNativeProps({ style: { opacity: 1 } })

        setTimeout(() => {
          if (!columnBorderRef.current) return
          columnBorderRef.current.setNativeProps({ style: { opacity: 0 } })
        }, 1000)
      }

      if (
        Platform.OS === 'web' &&
        columnRef.current &&
        !payload.focusOnVisibleItem
      ) {
        const currentFocusedNodeTag =
          typeof document !== 'undefined' &&
          document &&
          document.activeElement &&
          document.activeElement.tagName

        if (
          !(
            currentFocusedNodeTag &&
            currentFocusedNodeTag.toLowerCase() === 'input'
          )
        ) {
          tryFocus(columnRef.current)
        }
      }
    })

    useEffect(() => {
      if (!columnBorderRef.current) return
      columnBorderRef.current.setNativeProps({
        style: {
          opacity:
            isColumnFocused &&
            lastUsedInputType === 'keyboard' &&
            appViewMode === 'multi-column'
              ? 1
              : 0,
        },
      })
    }, [appViewMode, isColumnFocused, lastUsedInputType])

    return (
      <ThemedView
        {...otherProps}
        ref={columnRef}
        key={`column-${columnId}-inner`}
        backgroundColor={backgroundColor}
        style={[
          sharedStyles.relative,
          sharedStyles.horizontal,
          { width: columnWidth },
          sharedStyles.fullHeight,
          sharedStyles.overflowHidden,
          style,
        ]}
      >
        <DialogProvider>
          <>
            {!!renderLeftSeparator && <ColumnSeparator half />}
            <View style={sharedStyles.flex}>
              <ErrorBoundary FallbackComponent={ColumErrorFallbackComponent}>
                <CurrentColumnContext.Provider value={columnId}>
                  {children}
                </CurrentColumnContext.Provider>
              </ErrorBoundary>
            </View>
            {!!renderRightSeparator && <ColumnSeparator half />}

            <ThemedView
              ref={columnBorderRef}
              borderColor="foregroundColorMuted65"
              collapsable={false}
              pointerEvents="box-none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderWidth: 0,
                  borderRightWidth: Math.max(4, separatorThickSize),
                  borderLeftWidth: Math.max(4, separatorThickSize),
                  zIndex: 1000,
                  opacity:
                    isColumnFocused && lastUsedInputType === 'keyboard' ? 1 : 0,
                },
              ]}
            />
          </>
        </DialogProvider>
      </ThemedView>
    )
  }),
)

Column.displayName = 'Column'

const ColumErrorFallbackComponent: ErrorBoundaryProps['FallbackComponent'] = props => {
  const { error, info } = props

  return (
    <ThemedView style={sharedStyles.flex}>
      <View
        style={[sharedStyles.flex, sharedStyles.center, sharedStyles.padding]}
      >
        <GenericMessageWithButtonView
          buttonView={
            <ButtonLink
              analyticsLabel="column_error_boundary_open_issue_github"
              children="Open issue on GitHub"
              href={`https://github.com/devhubapp/devhub/issues/new?title=${url.format(
                (error && error.message) || 'Column view crashed',
              )}&body=${url.format(
                (info && info.componentStack) ||
                  (info && JSON.stringify(info)) ||
                  '',
              )}`}
              openOnNewTab
            />
          }
          emoji="warning"
          subtitle="Please open an issue on GitHub."
          title="This view has crashed"
        />
      </View>
    </ThemedView>
  )
}
