import React from 'react'

import { Column, getColumnOption } from '@devhub/core'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumn } from '../../hooks/use-column'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallerTextSize } from '../../styles/variables'
import { Checkbox, defaultCheckboxSize } from '../common/Checkbox'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { sharedColumnOptionsStyles } from './options/shared'

export interface ColumnOptionsProps {
  columnId: Column['id']
  isOpen?: boolean
}

export type ColumnOptionCategory = 'badge'

export const ColumnOptions = React.memo<ColumnOptionsProps>(props => {
  const { columnId } = props

  const dispatch = useDispatch()
  const columnIds = useReduxState(selectors.columnIdsSelector)

  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { column, columnIndex } = useColumn(columnId)

  if (!column) return null

  return (
    <ThemedView
      backgroundColor="backgroundColorDarker1"
      style={sharedStyles.fullWidth}
    >
      <Spacer height={contentPadding} />

      <Checkbox
        analyticsLabel="column_option_in_app_unread_indicator"
        checked={getColumnOption(
          column,
          'enableInAppUnreadIndicator',
          Platform.OS,
        )}
        containerStyle={
          sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
        }
        defaultValue
        squareContainerStyle={sharedColumnOptionsStyles.checkboxSquareContainer}
        enableIndeterminateState={false}
        label={`Show unread indicator at ${
          appOrientation === 'portrait' ? 'bottom bar' : 'sidebar'
        }`}
        onChange={value => {
          dispatch(
            actions.setColumnOption({
              columnId,
              option: 'enableInAppUnreadIndicator',
              value,
            }),
          )
        }}
      />

      {Platform.OS === 'web' && (
        <Checkbox
          analyticsLabel="column_option_app_icon_unread_indicator"
          checked={getColumnOption(
            column,
            'enableAppIconUnreadIndicator',
            Platform.OS,
          )}
          containerStyle={
            sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
          }
          defaultValue={column.type === 'notifications'}
          squareContainerStyle={
            sharedColumnOptionsStyles.checkboxSquareContainer
          }
          enableIndeterminateState={false}
          label={`Show unread counter on ${
            Platform.OS === 'web' && !Platform.isElectron
              ? 'page title'
              : 'app icon'
          }`}
          onChange={value => {
            dispatch(
              actions.setColumnOption({
                columnId,
                option: 'enableAppIconUnreadIndicator',
                value,
              }),
            )
          }}
        />
      )}

      <Checkbox
        analyticsLabel="column_option_push_notification"
        checked={false}
        containerStyle={
          sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
        }
        defaultValue={false}
        disabled
        squareContainerStyle={sharedColumnOptionsStyles.checkboxSquareContainer}
        enableIndeterminateState={false}
        label={
          <Link
            analyticsLabel="column_option_push_notification_soon_link"
            openOnNewTab
            href="https://github.com/devhubapp/devhub/issues/51"
            style={sharedStyles.flex}
          >
            <ThemedText
              color="foregroundColor"
              numberOfLines={1}
              style={[sharedStyles.flex, { lineHeight: defaultCheckboxSize }]}
            >
              Enable push notifications
            </ThemedText>
          </Link>
        }
        onChange={_checked => {
          // dispatch(
          //   actions.setColumnOption({
          //     columnId,
          //     option: 'enablePushNotifications',
          //     value,
          //   }),
          // )
        }}
        right={
          <Link
            analyticsLabel="column_option_push_notification_soon_link"
            openOnNewTab
            href="https://github.com/devhubapp/devhub/issues/51"
          >
            <ThemedText
              color="foregroundColor"
              style={{ fontSize: smallerTextSize }}
            >
              SOON
            </ThemedText>
          </Link>
        }
      />

      <View
        style={[
          sharedStyles.horizontal,
          { paddingHorizontal: contentPadding / 2 },
        ]}
      >
        <ColumnHeaderItem
          key="column-options-button-move-column-left"
          analyticsLabel="move_column_left"
          disabled={columnIndex === 0}
          fixedIconSize
          iconName="chevron-left"
          onPress={() =>
            dispatch(
              actions.moveColumn({
                animated: appViewMode === 'multi-column',
                columnId,
                columnIndex: columnIndex - 1,
                highlight: appViewMode === 'multi-column' || columnIndex === 0,
                scrollTo: true,
              }),
            )
          }
          style={{ opacity: columnIndex === 0 ? 0.5 : 1 }}
          tooltip={`Move column left (${
            keyboardShortcutsById.moveColumnLeft.keys[0]
          })`}
        />

        <ColumnHeaderItem
          key="column-options-button-move-column-right"
          analyticsLabel="move_column_right"
          disabled={columnIndex === columnIds.length - 1}
          fixedIconSize
          iconName="chevron-right"
          onPress={() =>
            dispatch(
              actions.moveColumn({
                animated: appViewMode === 'multi-column',
                columnId,
                columnIndex: columnIndex + 1,
                highlight:
                  appViewMode === 'multi-column' ||
                  columnIndex === columnIds.length - 1,
                scrollTo: true,
              }),
            )
          }
          style={{
            opacity: columnIndex === columnIds.length - 1 ? 0.5 : 1,
          }}
          tooltip={`Move column right (${
            keyboardShortcutsById.moveColumnRight.keys[0]
          })`}
        />

        <Spacer flex={1} />

        <ColumnHeaderItem
          key="column-options-button-remove-column"
          analyticsLabel="remove_column"
          fixedIconSize
          iconName="trashcan"
          onPress={() =>
            dispatch(actions.deleteColumn({ columnId, columnIndex }))
          }
          text=""
          tooltip="Remove column"
        />
      </View>

      <Separator horizontal />
    </ThemedView>
  )
})

ColumnOptions.displayName = 'ColumnOptions'
