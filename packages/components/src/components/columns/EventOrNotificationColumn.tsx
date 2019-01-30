import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'

import {
  Column as ColumnType,
  ColumnSubscription,
  getColumnHeaderDetails,
} from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { AccordionView } from '../common/AccordionView'
import { Spacer } from '../common/Spacer'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'

export interface EventOrNotificationColumnProps {
  children: React.ReactNode
  column: ColumnType
  columnIndex: number
  onColumnOptionsVisibilityChange?: (isOpen: boolean) => void
  pagingEnabled?: boolean
  subscriptions: Array<ColumnSubscription | undefined>
}

export const EventOrNotificationColumn = React.memo(
  (props: EventOrNotificationColumnProps) => {
    const {
      children,
      column,
      columnIndex,
      pagingEnabled,
      subscriptions,
      onColumnOptionsVisibilityChange,
    } = props

    const accordionRef = useRef<AccordionView>(null)

    const [
      columnOptionsContainerHeight,
      setColumnOptionsContainerHeight,
    ] = useState(0)

    const [showColumnOptions, setShowColumnOptions] = useState(false)

    const setColumnClearedAtFilter = useReduxAction(
      actions.setColumnClearedAtFilter,
    )

    useEffect(
      () => {
        if (onColumnOptionsVisibilityChange)
          onColumnOptionsVisibilityChange(showColumnOptions)
      },
      [onColumnOptionsVisibilityChange, showColumnOptions],
    )

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    const toggleOptions = () => {
      // this is more complex than usual
      // because im doing some weird workarounds
      // to fix the animation between nested accordions.
      // when this one opens, I "lock" it,
      // so the nested ones doesnt trigger an animation on this one.

      if (!accordionRef.current) return

      if (showColumnOptions) {
        if (accordionRef.current.isLocked()) {
          accordionRef.current.setOnFinishListener(() => {
            if (accordionRef.current) {
              accordionRef.current.setOnFinishListener(null)
            }

            setShowColumnOptions(false)
          })

          accordionRef.current.unlock()
        } else {
          accordionRef.current.setOnFinishListener(null)
          accordionRef.current.unlock()
          setShowColumnOptions(false)
        }
      } else {
        accordionRef.current.setOnFinishListener(() => {
          if (accordionRef.current) {
            accordionRef.current.setOnFinishListener(null)
            accordionRef.current.lock()
          }
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
            subtitle={`${requestTypeIconAndData.subtitle || ''}`.toLowerCase()}
            title={`${requestTypeIconAndData.title || ''}`.toLowerCase()}
            titleStyle={{ flex: 1 }}
            style={{ flex: 1, alignItems: 'flex-start' }}
          />

          <Spacer width={contentPadding / 2} />

          <ColumnHeaderItem
            analyticsLabel="clear_column"
            disabled={
              !!(
                column.filters &&
                column.filters.clearedAt &&
                subscriptions.some(s => {
                  if (!s) return false

                  if (s.type === 'activity') {
                    return !!(
                      s.data &&
                      s.data.items &&
                      !s.data.items.some(item => {
                        const date = item && item.created_at
                        return !!date && date > column.filters!.clearedAt!
                      })
                    )
                  }

                  if (s.type === 'notifications') {
                    return !!(
                      s.data &&
                      s.data.items &&
                      !s.data.items.some(item => {
                        const date = item && item.updated_at
                        return (
                          !!date && item.updated_at > column.filters!.clearedAt!
                        )
                      })
                    )
                  }

                  return false
                })
              )
            }
            enableForegroundHover
            fixedIconSize
            iconName="check"
            onPress={() =>
              setColumnClearedAtFilter({
                columnId: column.id,
                clearedAt: new Date().toISOString(),
              })
            }
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />
          <ColumnHeaderItem
            analyticsAction={showColumnOptions ? 'hide' : 'show'}
            analyticsLabel="column_options"
            enableForegroundHover
            fixedIconSize
            iconName="settings"
            onPress={toggleOptions}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
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
