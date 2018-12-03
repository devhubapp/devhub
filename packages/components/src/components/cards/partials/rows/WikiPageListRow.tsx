import React from 'react'

import { GitHubPage } from '@devhub/core/src/types'
import { RenderItem, RowList } from './RowList'
import { WikiPageRow } from './WikiPageRow'

export interface WikiPageListRowProps {
  isRead: boolean
  maxHeight?: number
  pages: GitHubPage[]
}

export function WikiPageListRow(props: WikiPageListRowProps) {
  const renderItem: RenderItem<GitHubPage> = ({
    item: page,
    showMoreItemsIndicator,
  }) => {
    if (!(page && page.sha && page.title)) return null

    return (
      <WikiPageRow
        key={`page-row-${page.sha}`}
        {...props}
        showMoreItemsIndicator={showMoreItemsIndicator}
        title={page.title}
        url={page.html_url || page.url}
      />
    )
  }

  const { pages, ...otherProps } = props

  if (!(pages && pages.length > 0)) return null

  return <RowList {...otherProps} data={pages} renderItem={renderItem} />
}
