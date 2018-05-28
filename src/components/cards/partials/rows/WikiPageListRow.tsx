import React, { PureComponent } from 'react'

import RowList, { RenderItem } from './RowList'
import WikiPageRow from './WikiPageRow'

import { IGitHubPage, ITheme } from '../../../../types'

export interface WikiPageListRowProps {
  isRead: boolean
  maxHeight?: number
  pages: IGitHubPage[]
  theme: ITheme
}

export default class WikiPageListRow extends PureComponent<
  WikiPageListRowProps
> {
  renderItem: RenderItem<IGitHubPage> = ({
    item: page,
    showMoreItemsIndicator,
  }) => {
    if (!(page && page.sha && page.title)) return null

    return (
      <WikiPageRow
        key={`page-row-${page.sha}`}
        {...this.props}
        showMoreItemsIndicator={showMoreItemsIndicator}
        title={page.title}
        url={page.html_url || page.url}
      />
    )
  }

  render() {
    const { pages, ...props } = this.props

    if (!(pages && pages.length > 0)) return null

    return <RowList {...props} data={pages} renderItem={this.renderItem} />
  }
}
