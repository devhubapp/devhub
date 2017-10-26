// @flow

import React from 'react'
import styled, { withTheme } from 'styled-components/native'
import { Map } from 'immutable'
import { RefreshControl, StyleSheet } from 'react-native'

import ColumnWithHeader, { getRadius } from './_ColumnWithHeader'
import ImmutableVirtualizedList from '../../libs/immutable-virtualized-list'
import TransparentTextOverlay from '../TransparentTextOverlay'
import { EmptyColumnContent } from './EmptyColumn'
import { contentPadding } from '../../styles/variables'
import { getDateWithHourAndMinuteText } from '../../utils/helpers'
import type { Subscription, ThemeObject } from '../../utils/types'

export * from './_ColumnWithHeader'

export const StyledTextOverlay = styled(TransparentTextOverlay)`
  flex: 1;
  border-radius: ${({ radius }) => radius || 0}px;
`

const styles = StyleSheet.create({
  list: { flex: 1, overflow: 'hidden' },
})

@withTheme
export default class ColumnWithList extends React.PureComponent {
  state = {
    hasLoadedOnce: false,
  }

  componentWillReceiveProps({ loading }) {
    // if finished loading
    if (!loading && !this.state.hasLoadedOnce) {
      this.setState({ hasLoadedOnce: true })
    }
  }

  props: {
    ListComponent?: ?React.element,
    errors?: ?Array<string>,
    icon: string,
    initialNumToRender?: number,
    isEmpty?: boolean,
    items: Array<Object>,
    loading?: boolean,
    onRefresh?: Function,
    radius?: number,
    readIds: Array<string>,
    refreshText?: string,
    renderItem: Function,
    renderSectionHeader?: Function,
    rightHeader?: ReactClass<any>,
    sectionHeaderHasChanged?: Function,
    style?: ?Object,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
    title: string,
    updatedAt?: Date,
    width?: number,
  }

  render() {
    const { hasLoadedOnce } = this.state
    const {
      initialNumToRender,
      isEmpty,
      items: _items,
      loading,
      onRefresh,
      refreshText: _refreshText,
      renderItem,
      renderSectionHeader,
      sectionHeaderHasChanged,
      theme,
      updatedAt,
      ...props
    } = this.props

    const items = _items || Map()
    const _radius = getRadius(props)

    let refreshText = _refreshText
    if (!refreshText && updatedAt) {
      const dateFromNowText = getDateWithHourAndMinuteText(updatedAt)
      refreshText = dateFromNowText ? `Updated ${dateFromNowText}` : ''
    }

    const refreshControl =
      (!!(onRefresh || refreshText) &&
        !!RefreshControl && (
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={[loading || !onRefresh ? 'transparent' : theme.base07]}
            tintColor={loading || !onRefresh ? 'transparent' : theme.base07}
            title={(refreshText || ' ').toLowerCase()}
            titleColor={theme.base05}
            progressBackgroundColor={theme.base02}
          />
        )) ||
      null

    const ListComponent = this.props.ListComponent || ImmutableVirtualizedList

    return (
      <ColumnWithHeader {...this.props}>
        <StyledTextOverlay
          color={theme.base02}
          size={contentPadding}
          from="vertical"
          radius={_radius}
        >
          {isEmpty || (!this.props.ListComponent && !(items.size > 0)) ? (
            loading && !hasLoadedOnce ? null : (
              <EmptyColumnContent refreshControl={refreshControl} />
            )
          ) : (
            <ListComponent
              immutableData={items}
              initialNumToRender={initialNumToRender || 5}
              rowsDuringInteraction={initialNumToRender || 5}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              refreshControl={refreshControl}
              sectionHeaderHasChanged={sectionHeaderHasChanged}
              removeClippedSubviews={
                false /* unfortunately react native still have the fucking blank screen bug  after all these fucking years */
              }
              style={styles.list}
              {...props}
            />
          )}
        </StyledTextOverlay>
      </ColumnWithHeader>
    )
  }
}
