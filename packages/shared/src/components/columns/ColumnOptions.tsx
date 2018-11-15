import _ from 'lodash'
import React, { useContext, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
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
import {
  ColumnHeaderItem,
  columnHeaderItemContentSize,
} from './ColumnHeaderItem'

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

export type ColumnOptionCategory = 'notification_types'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const { theme } = useContext(ThemeContext)
  const dimensions = useDimensions()
  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)

  const toggleOpenedOptionCategory = (
    optionCategory: ColumnOptionCategory | null,
  ) =>
    setOpenedOptionCategory(
      optionCategory === openedOptionCategory ? null : optionCategory,
    )

  const getChevronIcon = (optionCategory: ColumnOptionCategory | null) =>
    optionCategory === openedOptionCategory ? 'chevron-up' : 'chevron-down'

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
          <>
            <TouchableWithoutFeedback
              onPress={() => toggleOpenedOptionCategory('notification_types')}
            >
              <View style={{ flexDirection: 'row' }}>
                <ColumnHeaderItem
                  fixedIconSize
                  iconName="check"
                  selectable={false}
                  text="Notification types"
                />
                <Spacer flex={1} />
                <ColumnHeaderItem
                  iconName={getChevronIcon('notification_types')}
                  selectable={false}
                />
              </View>
            </TouchableWithoutFeedback>

            {openedOptionCategory === 'notification_types' && (
              <View
                style={{
                  paddingLeft:
                    columnHeaderItemContentSize + 1.5 * contentPadding,
                }}
              >
                {(() => {
                  const reasonsFilters =
                    (column.filters && column.filters.reasons) || {}

                  return notificationReasonOptions.map(nro => (
                    <View
                      key={`notification-reason-option-${nro.reason}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center',
                      }}
                    >
                      <Checkbox
                        checked={reasonsFilters[nro.reason] !== false}
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
                    </View>
                  ))
                })()}
              </View>
            )}
          </>
        )}

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
