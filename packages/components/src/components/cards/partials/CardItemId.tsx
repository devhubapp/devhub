import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { CardSmallThing } from './CardSmallThing'

export interface CardItemIdProps {
  icon?: GitHubIcon
  id: number | string
  style?: StyleProp<ViewStyle>
  url: string
}

export function CardItemId(props: CardItemIdProps) {
  const { icon, id, style, url } = props

  if (!(id || icon)) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  const text =
    typeof parsedNumber === 'number' ? `#${parsedNumber}` : `${id || ''}`

  return <CardSmallThing style={style} text={text} url={url} />
}
