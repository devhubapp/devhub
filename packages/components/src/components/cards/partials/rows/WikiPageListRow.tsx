import _ from 'lodash'
import React from 'react'

import { GitHubPage } from '@devhub/core'
import { RenderItem, RowList, RowListProps, rowListProps } from './RowList'
import { WikiPageRow, WikiPageRowProps } from './WikiPageRow'

interface ListProps extends Omit<RowListProps<GitHubPage>, 'renderItem'> {}
interface ItemProps extends Omit<WikiPageRowProps, 'title' | 'url'> {}

export interface WikiPageListRowProps extends ListProps, ItemProps {}

export const WikiPageListRow = React.memo((_props: WikiPageListRowProps) => {
  const listProps = _.pick(_props, rowListProps) as ListProps
  const itemProps = _.omit(_props, rowListProps) as ItemProps

  const renderItem: RenderItem<GitHubPage> = ({ item: page, index }) => {
    if (!(page && page.sha && page.title)) return null

    return (
      <WikiPageRow
        key={`page-row-${page.sha}`}
        {...itemProps}
        title={page.title}
        url={page.html_url || page.url}
        withTopMargin={index === 0 ? itemProps.withTopMargin : true}
      />
    )
  }

  return <RowList {...listProps} renderItem={renderItem} />
})

WikiPageListRow.displayName = 'WikiPageListRow'
