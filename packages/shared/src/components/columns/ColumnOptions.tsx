import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Column } from '../../types'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Spacer } from '../common/Spacer'
import { ThemeContext } from '../context/ThemeContext'
import { ColumnHeaderItem } from './ColumnHeaderItem'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  innerContainer: {},
})

export interface ColumnOptionsProps {
  column: Column
  columnIndex: number
}

export function ColumnOptions(props: ColumnOptionsProps) {
  const { theme } = useContext(ThemeContext)
  const moveColumn = useReduxAction(actions.moveColumn)
  const deleteColumn = useReduxAction(actions.deleteColumn)

  const { column, columnIndex } = props

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColorLess08,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={{ flexDirection: 'row' }}>
          <ColumnHeaderItem
            iconName="chevron-left"
            onPress={() =>
              moveColumn({ id: column.id, index: columnIndex - 1 })
            }
            style={{ paddingRight: contentPadding / 2 }}
          />
          <ColumnHeaderItem
            iconName="chevron-right"
            onPress={() =>
              moveColumn({ id: column.id, index: columnIndex + 1 })
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
      </View>

      <CardItemSeparator />
    </View>
  )
}
