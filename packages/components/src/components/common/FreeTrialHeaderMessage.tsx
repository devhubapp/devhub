import { Plan } from '@devhub/core'
import React from 'react'
import { useDispatch } from 'react-redux'

import * as actions from '../../redux/actions'
import { HeaderMessage } from './HeaderMessage'

export interface FreeTrialHeaderMessageProps {
  message?: string
  relatedFeature?: keyof Plan['featureFlags']
}

export function FreeTrialHeaderMessage(props: FreeTrialHeaderMessageProps) {
  const { message = 'Free trial. Learn more.', relatedFeature } = props

  const dispatch = useDispatch()

  return (
    <HeaderMessage
      analyticsLabel="about_free_trial_column"
      backgroundColor="primaryBackgroundColor"
      color="primaryForegroundColor"
      onPress={() =>
        dispatch(
          actions.pushModal({
            name: 'PRICING',
            params: { highlightFeature: relatedFeature },
          }),
        )
      }
    >
      {message}
    </HeaderMessage>
  )
}
