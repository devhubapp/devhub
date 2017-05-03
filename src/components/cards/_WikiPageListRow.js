// @flow

import React from 'react'

import WikiPageRow from './_WikiPageRow'
import RowList from './__RowList'

import type { Page } from '../../utils/types'

export default class WikiPageListRow extends React.PureComponent {
  props: {
    pages: Array<Page>,
    maxHeight?: number,
  }

  makeRenderItem = (passProps = {}) => ({ item: page }) =>
    page &&
    <WikiPageRow
      key={`wiki-page-row-${page.get('sha')}`}
      page={page}
      narrow
      {...passProps}
    />

  render() {
    const { maxHeight, pages, ...props } = this.props

    if (!(pages && pages.size > 0)) return null

    return (
      <RowList
        data={pages}
        maxHeight={maxHeight}
        renderItem={this.makeRenderItem(props)}
        {...props}
      />
    )
  }
}
