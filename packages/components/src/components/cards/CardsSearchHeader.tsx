import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

import {
  Column,
  getFilterFromSearchQuery,
  getSearchQueryFromFilter,
} from '@devhub/core'
import { useColumn } from '../../hooks/use-column'
import { useReduxAction } from '../../hooks/use-redux-action'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import { SearchBar, searchBarTotalHeight } from '../common/SearchBar'
import { separatorSize } from '../common/Separator'
import { CardItemSeparator } from './partials/CardItemSeparator'

export interface CardsSearchHeaderProps {
  autoFocus?: boolean
  columnId: Column['id']
  key: string
}

export const cardSearchTotalHeight = searchBarTotalHeight + separatorSize

export const CardsSearchHeader = React.memo((props: CardsSearchHeaderProps) => {
  const { autoFocus = false, columnId } = props

  const [isFocused, setIsFocused] = useState(false)
  const { column } = useColumn(columnId)

  const filtersQuery =
    (column && getSearchQueryFromFilter(column.type, column.filters)) ||
    undefined

  const formikProps = useFormik({
    enableReinitialize: !isFocused,
    initialValues: { query: filtersQuery || '' },
    onSubmit(values) {
      if (!column) return

      replaceColumnFilters({
        columnId: column.id,
        filters: getFilterFromSearchQuery(column.type, values.query, {
          clearedAt: column.filters && column.filters.clearedAt,
        }),
      })
    },
  })

  const replaceColumnFilters = useReduxAction(actions.replaceColumnFilters)

  const onFocus = useCallback(() => {
    setIsFocused(true)
    focusColumn(columnId)
  }, [columnId])

  const onBlur = useCallback(() => {
    setIsFocused(false)

    if (formikProps.values.query === formikProps.initialValues.query) return

    formikProps.setFieldTouched('query', true)
  }, [formikProps.values.query, formikProps.initialValues.query])

  const onChangeText = useCallback((query: string) => {
    formikProps.setFieldValue('query', `${query || ''}`)
  }, [])

  const onKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Escape') {
        formikProps.resetForm()
      }
    },
    [],
  )
  const onSubmit = useCallback(() => {
    formikProps.submitForm()
  }, [])

  const isPendingSave = !!(formikProps.dirty && formikProps.touched.query)

  if (!column) return null

  return (
    <>
      <SearchBar
        key={`cards-search-header-column-${column.id}`}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        blurOnSubmit={false}
        borderHoverThemeColor={isPendingSave ? 'yellow' : undefined}
        borderThemeColor={isPendingSave ? 'yellow' : undefined}
        clearButtonMode="while-editing"
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        textHoverThemeColor={isPendingSave ? 'yellow' : undefined}
        textInputKey={`search-bar-input-component-column-${column.id}`}
        textThemeColor={isPendingSave ? 'yellow' : undefined}
        value={formikProps.values.query}
      />

      <CardItemSeparator muted />
    </>
  )
})

function focusColumn(columnId: string) {
  emitter.emit('FOCUS_ON_COLUMN', {
    columnId,
    highlight: false,
    scrollTo: false,
  })
}
