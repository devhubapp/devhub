import { Plan } from '@devhub/core'
import React from 'react'
import { useDispatch } from 'react-redux'

import * as actions from '../../redux/actions'
import { HeaderMessage, HeaderMessageProps } from './HeaderMessage'
import { IntervalRefresh, IntervalRefreshProps } from './IntervalRefresh'

export type FreeTrialHeaderMessageProps = {
  backgroundColor?: HeaderMessageProps['backgroundColor']
  foregroundColor?: HeaderMessageProps['color']
  relatedFeature?: keyof Plan['featureFlags']
} & (
  | {
      intervalRefresh?: undefined
      message?: string
    }
  | {
      intervalRefresh: Omit<IntervalRefreshProps, 'children'>
      message: () => string
    }
)

export function FreeTrialHeaderMessage(props: FreeTrialHeaderMessageProps) {
  const {
    backgroundColor = 'primaryBackgroundColor',
    foregroundColor,
    intervalRefresh,
    message = 'Free trial. Learn more.',
    relatedFeature,
  } = props

  const dispatch = useDispatch()

  const getComponent = () => (
    <HeaderMessage
      analyticsLabel="about_free_trial_column"
      backgroundColor={backgroundColor}
      color={
        foregroundColor ||
        (backgroundColor === 'primaryBackgroundColor'
          ? 'primaryForegroundColor'
          : 'foregroundColor')
      }
      onPress={() =>
        dispatch(
          actions.pushModal({
            name: 'PRICING',
            params: { highlightFeature: relatedFeature },
          }),
        )
      }
    >
      {typeof message === 'function' ? message() : message}
    </HeaderMessage>
  )

  if (intervalRefresh) {
    return (
      <IntervalRefresh {...intervalRefresh}>{getComponent}</IntervalRefresh>
    )
  }

  return getComponent()
}
