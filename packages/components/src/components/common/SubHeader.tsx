import React from 'react'

import { View } from 'react-native'
import { IconProp } from '../../libs/vector-icons'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, scaleFactor } from '../../styles/variables'
import { ThemedIcon } from '../themed/ThemedIcon'
import { H2 } from './H2'
import { Spacer } from './Spacer'

export interface SubHeaderProps {
  children?: React.ReactNode
  icon?: IconProp
  muted?: boolean
  title?: string
}

export function SubHeader(props: SubHeaderProps) {
  const { children, icon, muted, title } = props

  return (
    <View
      style={[
        sharedStyles.horizontal,
        sharedStyles.justifyContentFlexStart,
        sharedStyles.alignSelfStretch,
        sharedStyles.alignItemsCenter,
        sharedStyles.padding,
      ]}
    >
      {!!(icon && icon.name) && (
        <ThemedIcon {...icon} color="foregroundColor" size={18 * scaleFactor} />
      )}

      {!!title && (
        <>
          {!!(icon && icon.name) && <Spacer width={contentPadding / 2} />}

          <H2 muted={muted} withMargin={false}>
            {title}
          </H2>
        </>
      )}

      {children}
    </View>
  )
}
