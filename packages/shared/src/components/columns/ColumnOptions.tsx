import _ from 'lodash'
import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { useDimensions } from '../../hooks/use-dimensions'
import { useReduxAction } from '../../hooks/use-redux-action'
import { Octicons as Icon } from '../../libs/vector-icons'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Column } from '../../types'
import {
  eventTypes,
  getEventTypeMetadata,
} from '../../utils/helpers/github/events'
import {
  getNotificationReasonMetadata,
  notificationReasons,
} from '../../utils/helpers/github/notifications'
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

const notificationReasonOptions = notificationReasons
  .map(getNotificationReasonMetadata)
  .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

const eventTypeOptions = eventTypes
  .map(getEventTypeMetadata)
  .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

export interface ColumnOptionsProps {
  column: Column
  columnIndex: number
}

export type ColumnOptionCategory =
  | 'event_types'
  | 'notification_types'
  | 'privacy'
  | 'unread'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const { theme } = useContext(ThemeContext)
  const deleteColumn = useReduxAction(actions.deleteColumn)
  const dimensions = useDimensions()
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnActivityTypeFilter = useReduxAction(
    actions.setColumnActivityTypeFilter,
  )
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
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
            contentContainerStyle={{
              marginVertical: -contentPadding / 4,
              marginRight: contentPadding,
            }}
            iconName="check"
            onToggle={() => toggleOpenedOptionCategory('notification_types')}
            opened={openedOptionCategory === 'notification_types'}
            title="Notification types"
          >
            {notificationReasonOptions.map(nro => (
              <Checkbox
                key={`notification-reason-option-${nro.reason}`}
                checked={
                  column.filters &&
                  column.filters.notifications &&
                  column.filters.notifications.reasons &&
                  column.filters.notifications.reasons[nro.reason] === false
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
          </ColumnOptionsRow>
        )}

        {column.type === 'activity' && (
          <ColumnOptionsRow
            contentContainerStyle={{
              marginVertical: -contentPadding / 4,
              marginRight: contentPadding,
            }}
            iconName="check"
            onToggle={() => toggleOpenedOptionCategory('event_types')}
            opened={openedOptionCategory === 'event_types'}
            title="Event types"
          >
            {eventTypeOptions.map(eto => (
              <Checkbox
                key={`event-type-option-${eto.type}`}
                checked={
                  column.filters &&
                  column.filters.activity &&
                  column.filters.activity.types &&
                  column.filters.activity.types[eto.type] === false
                    ? false
                    : true
                }
                containerStyle={{
                  flexGrow: 1,
                  paddingVertical: contentPadding / 4,
                }}
                label={
                  <View
                    style={{
                      flexGrow: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: contentPadding / 2,
                        color: theme.foregroundColor,
                      }}
                    >
                      {eto.label}
                    </Text>

                    <Icon
                      color={theme.foregroundColor}
                      name={eto.icon}
                      size={16}
                    />
                  </View>
                }
                onChange={checked => {
                  setColumnActivityTypeFilter({
                    columnId: column.id,
                    type: eto.type,
                    value: checked,
                  })
                }}
              />
            ))}
          </ColumnOptionsRow>
        )}

        {column.type === 'notifications' &&
          (() => {
            const isReadChecked = !(
              column.filters && column.filters.unread === true
            )

            const isUnreadChecked = !(
              column.filters && column.filters.unread === false
            )

            const getFilterValue = (read?: boolean, unread?: boolean) =>
              read && unread ? undefined : read ? false : unread

            return (
              <ColumnOptionsRow
                contentContainerStyle={{ marginRight: contentPadding }}
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

        {(() => {
          const isPrivateChecked = !(
            column.filters && column.filters.private === false
          )

          const isPublicChecked = !(
            column.filters && column.filters.private === true
          )

          const getFilterValue = (
            showPublic?: boolean,
            showPrivate?: boolean,
          ) =>
            showPublic && showPrivate
              ? undefined
              : showPublic
              ? false
              : showPrivate

          return (
            <ColumnOptionsRow
              contentContainerStyle={{ marginRight: contentPadding }}
              iconName="lock"
              onToggle={() => toggleOpenedOptionCategory('privacy')}
              opened={openedOptionCategory === 'privacy'}
              title="Privacy"
            >
              <Checkbox
                checked={isPublicChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isPublicChecked && !isPrivateChecked}
                label="Public"
                onChange={checked => {
                  setColumnPrivacyFilter({
                    columnId: column.id,
                    private: getFilterValue(checked, isPrivateChecked),
                  })
                }}
              />

              <Spacer height={contentPadding / 2} />

              <Checkbox
                checked={isPrivateChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isPrivateChecked && !isPublicChecked}
                label="Private"
                onChange={checked => {
                  setColumnPrivacyFilter({
                    columnId: column.id,
                    private: getFilterValue(isPublicChecked, checked),
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
