import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { CardSmallThing } from './CardSmallThing'

export interface CardItemIdProps {
  icon?: GitHubIcon
  id: number | string
  isRead: boolean
  style?: StyleProp<ViewStyle>
  url: string
}

export function CardItemId(props: CardItemIdProps) {
  const { icon, id, isRead, style, url } = props

  if (!(id || icon)) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  const text =
    typeof parsedNumber === 'number' ? `#${parsedNumber}` : `${id || ''}`

  return <CardSmallThing isRead={isRead} style={style} text={text} url={url} />
}
