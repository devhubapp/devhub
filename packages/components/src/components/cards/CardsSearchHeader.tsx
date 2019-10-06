import {
  Column,
  getFilterFromSearchQuery,
  getSearchQueryFromFilter,
  getSearchQueryTerms,
} from '@devhub/core'
import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'

import { useColumn } from '../../hooks/use-column'
import { usePrevious } from '../../hooks/use-previous'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ColumnFiltersButton } from '../columns/ColumnFiltersButton'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { IconButton } from '../common/IconButton'
import { ScrollViewWithOverlay } from '../common/ScrollViewWithOverlay'
import {
  SearchBar,
  searchBarMainContentHeight,
  searchBarOuterSpacing,
  searchBarTotalHeight,
} from '../common/SearchBar'
import { Separator, separatorSize } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { TagToken } from '../common/TagToken'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { ThemedView } from '../themed/ThemedView'

export interface CardsSearchHeaderProps {
  autoFocus?: boolean
  columnId: Column['id']
  key: string
}

export const cardSearchTotalHeight = searchBarTotalHeight + separatorSize

export const CardsSearchHeader = React.memo((props: CardsSearchHeaderProps) => {
  const { autoFocus: _autoFocus = false, columnId } = props

  const dispatch = useDispatch()

  const [isFocused, setIsFocused] = useState(false)
  const [forceShowTextInput, setForceShowTextInput] = useState(false)
  const { column } = useColumn(columnId)

  const { inlineMode } = useColumnFilters()

  const allFiltersQuery =
    (column &&
      getSearchQueryFromFilter(column.type, column.filters, {
        groupByKey: false,
      })) ||
    undefined

  const queryTerms = getSearchQueryTerms(allFiltersQuery)

  function replaceColumnFiltersFromQueryString(q: string) {
    if (!column) return

    dispatch(
      actions.replaceColumnFilters({
        columnId: column.id,
        filters: getFilterFromSearchQuery(column.type, q, {
          clearedAt: column.filters && column.filters.clearedAt,
        }),
      }),
    )
  }

  const formikProps = useFormik({
    enableReinitialize: !isFocused,
    initialValues: {
      query: (column && column.filters && column.filters.query) || '',
    },
    onSubmit(values) {
      if (!column) return

      const allFiltersQueryWithoutQuery =
        column &&
        getSearchQueryFromFilter(
          column.type,
          { ...column.filters, query: values.query || '' },
          {
            groupByKey: false,
          },
        )

      replaceColumnFiltersFromQueryString(allFiltersQueryWithoutQuery)

      if (forceShowTextInput && !values.query) setForceShowTextInput(false)
    },
  })

  const onFocus = useCallback(() => {
    setIsFocused(true)
    focusColumn(columnId)
  }, [columnId])

  const onBlur = useCallback(() => {
    setIsFocused(false)
    if (Platform.supportsTouch) setForceShowTextInput(false)

    if (
      formikProps.values.query.trim() === formikProps.initialValues.query.trim()
    )
      return

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

  const showTextInput = forceShowTextInput || !queryTerms.length || isFocused
  const previousForceShowTextInput = usePrevious(forceShowTextInput)

  const autoFocus =
    _autoFocus ||
    (forceShowTextInput && previousForceShowTextInput === false) ||
    isFocused

  if (!column) return null

  function renderMainContent() {
    if (!column) return null

    if (!showTextInput) {
      return (
        <View
          style={[
            sharedStyles.flex,
            sharedStyles.horizontalAndVerticallyAligned,
            { height: searchBarTotalHeight },
          ]}
        >
          <ScrollViewWithOverlay
            horizontal
            containerStyle={[
              sharedStyles.flex,
              { height: searchBarTotalHeight },
            ]}
            contentContainerStyle={[
              sharedStyles.alignItemsCenter,
              sharedStyles.justifyContentCenter,
              { padding: searchBarOuterSpacing },
            ]}
            style={[
              sharedStyles.fullWidth,
              sharedStyles.fullMaxWidth,
              { height: searchBarTotalHeight },
            ]}
          >
            {queryTerms.map((termArr, index) => {
              const [key, value, isNegated] =
                termArr.length === 2 ? ['', termArr[0], termArr[1]] : termArr
              if (!(value && typeof value === 'string')) return false

              return (
                <>
                  {index > 0 && <Spacer width={contentPadding / 4} />}

                  <TagToken
                    label={`${key ? `${key}:${value}` : value}`}
                    onPress={() => {
                      const queryString = queryTerms
                        .map((_termArr, _index) => {
                          const [_key, _value, _isNegated] =
                            _termArr.length === 2
                              ? ['', _termArr[0], _termArr[1]]
                              : _termArr
                          if (!(_value && typeof _value === 'string')) return ''

                          const _newIsNegated =
                            _index === index ? !_isNegated : _isNegated

                          if (
                            _index === index &&
                            _key === 'inbox' &&
                            _newIsNegated
                          )
                            return _value === 'participating'
                              ? 'inbox:all'
                              : 'inbox:participating'

                          return `${_newIsNegated ? '-' : ''}${
                            _key ? `${_key}:${_value}` : _value
                          }`
                        })
                        .filter(Boolean)
                        .join(' ')
                        .trim()

                      replaceColumnFiltersFromQueryString(queryString)
                    }}
                    onRemove={
                      key === 'inbox'
                        ? undefined
                        : () => {
                            const queryString = queryTerms
                              .map((_termArr, _index) => {
                                if (_index === index) return

                                const [_key, _value, _isNegated] =
                                  _termArr.length === 2
                                    ? ['', _termArr[0], _termArr[1]]
                                    : _termArr
                                if (!(_value && typeof _value === 'string'))
                                  return ''

                                const _newIsNegated =
                                  _index === index ? !_isNegated : _isNegated

                                return `${_newIsNegated ? '-' : ''}${
                                  _key ? `${_key}:${_value}` : _value
                                }`
                              })
                              .filter(Boolean)
                              .join(' ')
                              .trim()

                            replaceColumnFiltersFromQueryString(queryString)
                          }
                    }
                    size={searchBarMainContentHeight}
                    strikethrough={isNegated}
                  />
                </>
              )
            })}
          </ScrollViewWithOverlay>

          <Spacer width={contentPadding / 2} />
        </View>
      )
    }

    return (
      <SearchBar
        key={`cards-search-header-column-${column.id}`}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        blurOnSubmit={false}
        borderHoverThemeColor={isPendingSave ? 'yellow' : undefined}
        borderThemeColor={isPendingSave ? 'yellow' : undefined}
        clearButtonMode="while-editing"
        containerBackgroundThemeColor={null}
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
    )
  }

  return (
    <ThemedView
      backgroundColor={getColumnHeaderThemeColors().normal}
      style={[sharedStyles.fullWidth, sharedStyles.fullMaxWidth]}
    >
      <View
        style={[
          sharedStyles.horizontalAndVerticallyAligned,
          sharedStyles.fullWidth,
          sharedStyles.fullMaxWidth,
        ]}
      >
        {renderMainContent()}

        {!!queryTerms.length && (
          <IconButton
            key="column-search-toggle-button"
            active={forceShowTextInput}
            analyticsAction="toggle"
            analyticsLabel="column_search"
            name="search"
            onPress={() => {
              setForceShowTextInput(v => !v)
            }}
            style={{ paddingHorizontal: contentPadding / 3 }}
            tooltip="Search"
          />
        )}

        {!inlineMode && <ColumnFiltersButton columnId={column.id} />}

        <Spacer width={contentPadding / 2} />
      </View>

      <Separator horizontal />
    </ThemedView>
  )
})

CardsSearchHeader.displayName = 'CardsSearchHeader'

function focusColumn(columnId: string) {
  emitter.emit('FOCUS_ON_COLUMN', {
    columnId,
    highlight: false,
    scrollTo: false,
  })
}
