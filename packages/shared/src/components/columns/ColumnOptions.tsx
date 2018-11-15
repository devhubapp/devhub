import _ from 'lodash'
import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useDimensions } from '../../hooks/use-dimensions'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Column, GitHubNotificationReason } from '../../types'
import { getNotificationReasonTextsAndColor } from '../../utils/helpers/github/notifications'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Checkbox } from '../common/Checkbox'
import { Spacer } from '../common/Spacer'
import { ThemeContext } from '../context/ThemeContext'
import { columnHeaderHeight } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRow } from './ColumnOptionsRow'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  innerContainer: {},
})

const notificationReasons: GitHubNotificationReason[] = [
  'assign',
  'author',
  'comment',
  'invitation',
  'manual',
  'mention',
  'review_requested',
  'state_change',
  'subscribed',
  'team_mention',
]

const notificationReasonOptions = notificationReasons
  .map(getNotificationReasonTextsAndColor)
  .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

export interface ColumnOptionsProps {
  column: Column
  columnIndex: number
}

export type ColumnOptionCategory = 'notification_types' | 'unread'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const { theme } = useContext(ThemeContext)
  const deleteColumn = useReduxAction(actions.deleteColumn)
  const dimensions = useDimensions()
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColumnUnreadFilter = useReduxAction(actions.setColumnUnreadFilter)

  const toggleOpenedOptionCategory = (
    optionCategory: ColumnOptionCategory | null,
  ) =>
    setOpenedOptionCategory(
      optionCategory === openedOptionCategory ? null : optionCategory,
    )

  const { column, columnIndex } = props

  return (
    <View
      style={[
        styles.container,
        {
          maxHeight: dimensions.window.height - columnHeaderHeight,
          backgroundColor: theme.backgroundColorLess08,
        },
      ]}
    >
      <ScrollView alwaysBounceVertical={false} style={styles.innerContainer}>
        {column.type === 'notifications' && (
          <ColumnOptionsRow
            iconName="check"
            onToggle={() => toggleOpenedOptionCategory('notification_types')}
            opened={openedOptionCategory === 'notification_types'}
            title="Notification types"
          >
            <View style={{ marginVertical: -contentPadding / 4 }}>
              {notificationReasonOptions.map(nro => (
                <Checkbox
                  key={`notification-reason-option-${nro.reason}`}
                  checked={
                    column.filters &&
                    column.filters.reasons &&
                    column.filters.reasons[nro.reason] === false
                      ? false
                      : true
                  }
                  checkedBackgroundColor={nro.color}
                  checkedForegroundColor={theme.backgroundColorDarker08}
                  containerStyle={{
                    flexGrow: 1,
                    paddingVertical: contentPadding / 4,
                  }}
                  label={nro.label}
                  onChange={checked => {
                    setColumnReasonFilter({
                      columnId: column.id,
                      reason: nro.reason,
                      value: checked,
                    })
                  }}
                  uncheckedForegroundColor={nro.color}
                />
              ))}
            </View>
          </ColumnOptionsRow>
        )}

        {column.type === 'notifications' &&
          (() => {
            const isReadChecked =
              column.filters && column.filters.unread !== true

            const isUnreadChecked =
              column.filters && column.filters.unread !== false

            const getFilterValue = (read?: boolean, unread?: boolean) =>
              read && unread ? undefined : read ? false : unread

            return (
              <ColumnOptionsRow
                iconName="eye"
                onToggle={() => toggleOpenedOptionCategory('unread')}
                opened={openedOptionCategory === 'unread'}
                title="Read status"
              >
                <Checkbox
                  checked={isReadChecked}
                  containerStyle={{ flexGrow: 1 }}
                  disabled={isReadChecked && !isUnreadChecked}
                  label="Read"
                  onChange={checked => {
                    setColumnUnreadFilter({
                      columnId: column.id,
                      unread: getFilterValue(checked, isUnreadChecked),
                    })
                  }}
                />

                <Spacer height={contentPadding / 2} />

                <Checkbox
                  checked={isUnreadChecked}
                  containerStyle={{ flexGrow: 1 }}
                  disabled={isUnreadChecked && !isReadChecked}
                  label="Unread"
                  onChange={checked => {
                    setColumnUnreadFilter({
                      columnId: column.id,
                      unread: getFilterValue(isReadChecked, checked),
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}

        <View style={{ flexDirection: 'row' }}>
          <ColumnHeaderItem
            iconName="chevron-left"
            onPress={() =>
              moveColumn({ columnId: column.id, columnIndex: columnIndex - 1 })
            }
            style={{ paddingRight: contentPadding / 2 }}
          />
          <ColumnHeaderItem
            iconName="chevron-right"
            onPress={() =>
              moveColumn({ columnId: column.id, columnIndex: columnIndex + 1 })
            }
            style={{ paddingLeft: contentPadding / 2 }}
          />

          <Spacer flex={1} />

          <ColumnHeaderItem
            iconName="trashcan"
            onPress={() => deleteColumn(column.id)}
            text="Remove"
          />
        </View>
      </ScrollView>
      <CardItemSeparator />
    </View>
  )
}
