import React, { useRef, useState } from 'react'
import { View } from 'react-native'

import {
  Column as ColumnType,
  ColumnSubscription,
  getColumnHeaderDetails,
} from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { AccordionView } from '../common/AccordionView'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'

export interface EventOrNotificationColumnProps {
  children: React.ReactNode
  column: ColumnType
  columnIndex: number
  pagingEnabled?: boolean
  subscriptions: Array<ColumnSubscription | undefined>
}

export const EventOrNotificationColumn = React.memo(
  (props: EventOrNotificationColumnProps) => {
    const accordionRef = useRef<AccordionView>(null)

    const [
      columnOptionsContainerHeight,
      setColumnOptionsContainerHeight,
    ] = useState(0)

    const [showColumnOptions, setShowColumnOptions] = useState(false)

    const { sizename } = useAppLayout()

    const setColumnClearedAtFilter = useReduxAction(
      actions.setColumnClearedAtFilter,
    )

    const {
      children,
      column,
      columnIndex,
      pagingEnabled,
      subscriptions,
    } = props

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    const toggleOptions = () => {
      // this is more complex than usual
      // because im doing some weird workarounds
      // to fix the animation between nested accordions.
      // when this one opens, I "lock" it,
      // so the nested ones doesnt trigger an animation on this one.

      if (showColumnOptions) {
        if (accordionRef.current!.isLocked()) {
          accordionRef.current!.setOnFinishListener(() => {
            accordionRef.current!.setOnFinishListener(null)
            setShowColumnOptions(false)
          })

          accordionRef.current!.unlock()
        } else {
          accordionRef.current!.setOnFinishListener(null)
          accordionRef.current!.unlock()
          setShowColumnOptions(false)
        }
      } else {
        accordionRef.current!.setOnFinishListener(() => {
          accordionRef.current!.setOnFinishListener(null)
          accordionRef.current!.lock()
        })

        setShowColumnOptions(true)
      }
    }

    return (
      <Column columnId={column.id} pagingEnabled={pagingEnabled}>
        <ColumnHeader>
          <ColumnHeaderItem
            analyticsLabel={undefined}
            avatarProps={requestTypeIconAndData.avatarProps}
            fixedIconSize
            iconName={requestTypeIconAndData.icon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
          />

          <Spacer flex={1} />

          <ColumnHeaderItem
            analyticsLabel="clear_column"
            disabled={
              column.filters &&
              column.filters.inbox &&
              column.filters.inbox &&
              column.filters.inbox.archived === true
            }
            enableForegroundHover
            iconName="check"
            onPress={() =>
              setColumnClearedAtFilter({
                columnId: column.id,
                clearedAt: new Date().toISOString(),
              })
            }
          />
          <ColumnHeaderItem
            analyticsAction={showColumnOptions ? 'hide' : 'show'}
            analyticsLabel="column_options"
            enableForegroundHover
            iconName="settings"
            onPress={toggleOptions}
          />
        </ColumnHeader>

        <View
          style={{ flex: 1 }}
          onLayout={e => {
            setColumnOptionsContainerHeight(e.nativeEvent.layout.height)
          }}
        >
          <ColumnOptionsRenderer
            accordionRef={accordionRef}
            close={toggleOptions}
            column={column}
            columnIndex={columnIndex}
            containerHeight={columnOptionsContainerHeight}
            visible={!!showColumnOptions}
          />

          {children}
        </View>
      </Column>
    )
  },
)
