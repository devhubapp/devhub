import { activePlans } from '@devhub/core'
import React from 'react'
import { View } from 'react-native'

import { sharedStyles } from '../../../styles/shared'
import { SubHeader } from '../../common/SubHeader'
import { ThemedTextInput } from '../../themed/ThemedTextInput'
import { SubscribeFormProps } from './SubscribeForm.shared'

export function SubscribeForm(props: SubscribeFormProps) {
  const { planId } = props

  const plan = planId && activePlans.find(p => p.id === planId)
  if (!(plan && plan.id)) return null

  return (
    <View style={sharedStyles.fullWidth}>
      <SubHeader title="Card" />

      <View style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}>
        <ThemedTextInput textInputKey="stripe-text-input" />
      </View>
    </View>
  )
}
