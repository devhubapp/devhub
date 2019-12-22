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
  ScrollViewProps,
  TextInputKeyPressEventData,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { batch, useDispatch } from 'react-redux'

import { useColumn } from '../../hooks/use-column'
import { usePrevious } from '../../hooks/use-previous'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { vibrateHapticFeedback } from '../../utils/helpers/shared'
import { KeyboardKeyIsPressed } from '../AppKeyboardShortcuts'
import { ColumnFiltersButton } from '../columns/ColumnFiltersButton'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { IconButton } from '../common/IconButton'
import {
  ScrollViewWithOverlay,
  ScrollViewWithOverlayProps,
} from '../common/ScrollViewWithOverlay'
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

const ScrollViewComponent = Platform.select<
  () => ScrollViewWithOverlayProps['ScrollViewComponent']
>({
  android: () => {
    const GestureHandlerScrollView = require('react-native-gesture-handler')
      .ScrollView
    return (p: ScrollViewProps) => (
      <GestureHandlerScrollView {...p} nestedScrollEnabled />
    )
  },
  default: () => undefined,
})()

export const CardsSearchHeader = React.memo((props: CardsSearchHeaderProps) => {
  const { autoFocus: _autoFocus = false, columnId } = props

  const dispatch = useDispatch()

  const [isFocused, setIsFocused] = useState(false)
  const [forceShowTextInput, setForceShowTextInput] = useState(false)
  const { column } = useColumn(columnId)

  const { inlineMode } = useColumnFilters()

  const allFiltersQuery =
    (column &&
      getSearchQueryFromFilter(
        column.type,
        { ...column.filters, saved: undefined },
        {
          groupByKey: false,
        },
      )) ||
    undefined

  const queryTerms = getSearchQueryTerms(allFiltersQuery)

  function replaceColumnFiltersFromQueryString(
    q: string,
    {
      preserveExistingOwners = !!(column && column.type === 'issue_or_pr'),
    } = {},
  ) {
    if (!column) return

    vibrateHapticFeedback()

    const filters: Column['filters'] = getFilterFromSearchQuery(
      column.type,
      q,
      { clearedAt: column.filters && column.filters.clearedAt },
    )

    if (preserveExistingOwners) {
      filters.owners = filters.owners || {}
      Object.keys((column.filters && column.filters.owners) || {}).forEach(
        existingOwner => {
          if (!filters.owners![existingOwner]) {
            filters.owners![existingOwner] = {
              value: undefined,
              repos: undefined,
            }
          }
        },
      )
    }

    dispatch(actions.replaceColumnFilters({ columnId: column.id, filters }))
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

    const saved = column.filters && column.filters.saved

    const FilterTagBookmark = (
      <View
        key={`filter-tag-bookmark`}
        style={sharedStyles.horizontalAndVerticallyAligned}
      >
        <TagToken
          icon={{
            family: 'material',
            name: 'bookmark',
            color:
              typeof saved === 'boolean' ? undefined : 'foregroundColorMuted65',
          }}
          onPress={() => {
            vibrateHapticFeedback()

            dispatch(
              actions.setColumnSavedFilter({
                columnId,
                saved: KeyboardKeyIsPressed.alt
                  ? false
                  : saved === true
                  ? null
                  : true,
              }),
            )
          }}
          onRemove={undefined}
          size={searchBarMainContentHeight}
          strikethrough={saved === false}
          transparent={typeof saved !== 'boolean'}
          tooltip="Toggle bookmark filter"
        />
      </View>
    )

    if (!showTextInput) {
      return (
        <View style={[sharedStyles.flex, { height: searchBarTotalHeight }]}>
          <ScrollViewWithOverlay
            alwaysBounceHorizontal={false}
            bottomOrRightOverlayThemeColor={getColumnHeaderThemeColors().normal}
            containerStyle={[sharedStyles.flex, sharedStyles.fullHeight]}
            contentContainerStyle={[
              sharedStyles.horizontalAndVerticallyAligned,
              { padding: searchBarOuterSpacing },
            ]}
            horizontal
            overlaySize={searchBarOuterSpacing}
            ScrollViewComponent={ScrollViewComponent}
            style={[
              sharedStyles.flex,
              sharedStyles.horizontal,
              sharedStyles.fullHeight,
            ]}
            topOrLeftOverlayThemeColor={getColumnHeaderThemeColors().normal}
          >
            {FilterTagBookmark}
            <Spacer width={contentPadding / 4} />

            {queryTerms.map((termArr, index) => {
              const [key, value, isNegated] =
                termArr.length === 2 ? ['', termArr[0], termArr[1]] : termArr
              if (!(value && typeof value === 'string')) return null

              // we already show the saved tag everytime
              if (key === 'is' && value === 'saved') return null

              return (
                <View
                  key={`filter-tag-${termArr.join('-')}`}
                  style={sharedStyles.horizontalAndVerticallyAligned}
                >
                  {index > 0 && <Spacer width={contentPadding / 4} />}

                  <TagToken
                    label={`${key ? `${key}:${value}` : value}`}
                    onPress={() => {
                      vibrateHapticFeedback()

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

                            replaceColumnFiltersFromQueryString(queryString, {
                              preserveExistingOwners: false,
                            })
                          }
                    }
                    size={searchBarMainContentHeight}
                    strikethrough={isNegated}
                  />
                </View>
              )
            })}
          </ScrollViewWithOverlay>

          <Spacer width={contentPadding / 2} />
        </View>
      )
    }

    return (
      <View
        style={[
          sharedStyles.flex,
          sharedStyles.fullMaxWidth,
          sharedStyles.horizontalAndVerticallyAligned,
        ]}
      >
        <Spacer width={searchBarOuterSpacing} />
        {FilterTagBookmark}
        <Spacer width={contentPadding / 4} />

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
          noPaddingHorizontal
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

        <Spacer width={searchBarOuterSpacing} />
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPress={
        columnId
          ? () => {
              // fix bug on web (it was scrolling to the top when tapping the input)
              const currentFocusedNodeTag =
                typeof document !== 'undefined' &&
                document &&
                document.activeElement &&
                document.activeElement.tagName
              if (
                currentFocusedNodeTag &&
                currentFocusedNodeTag.toLowerCase() === 'input'
              )
                return

              emitter.emit('SCROLL_TOP_COLUMN', { columnId })
            }
          : undefined
      }
    >
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
              family="octicon"
              name="search"
              onPress={() => {
                batch(() => {
                  if (forceShowTextInput) {
                    setIsFocused(false)
                    setForceShowTextInput(false)
                  } else {
                    setForceShowTextInput(true)
                  }
                })
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
    </TouchableWithoutFeedback>
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
