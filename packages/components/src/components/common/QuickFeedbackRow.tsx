import { constants } from '@devhub/core'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { batch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { getDefaultDevHubHeaders } from '../../utils/api'
import { ThemedText } from '../themed/ThemedText'
import { ThemedTextInput } from '../themed/ThemedTextInput'
import { Link } from './Link'
import { defaultTextInputHeight } from './TextInput'

export interface QuickFeedbackRowProps {}

export const quickFeedbackRowHeight = defaultTextInputHeight

export function QuickFeedbackRow(_props: QuickFeedbackRowProps) {
  const isMountedRef = useRef(true)

  const [feedbackText, setFeedbackText] = useState('')
  const [message, setMessage] = useState('')
  const [placeholder, setPlaceholder] = useState('')

  const appToken = useReduxState(selectors.appTokenSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  async function trySendFeedback() {
    const response = await axios.post(
      constants.GRAPHQL_ENDPOINT,
      {
        query: `
              mutation($input: SendFeedbackInput) {
                sendFeedback(input: $input)
              }`,
        variables: {
          input: {
            feedback: feedbackText || '',
            screeName: (currentOpenedModal && currentOpenedModal.name) || '',
          },
        },
      },
      { headers: getDefaultDevHubHeaders({ appToken }) },
    )

    if (!isMountedRef.current) return

    const { data, errors } = await response.data

    if (errors && errors[0] && errors[0].message)
      throw new Error(errors[0].message)

    if (!(data && data.sendFeedback)) {
      throw new Error('Failed to send feedback.')
    }
  }

  async function handleSubmit() {
    if (!isMountedRef.current) return

    if (!(feedbackText && feedbackText.trim())) return

    try {
      setMessage('Sending...')

      await trySendFeedback()
      if (!isMountedRef.current) return

      if (feedbackText.toLowerCase().includes('expensive')) {
        setMessage('Got it...')

        setTimeout(() => {
          setMessage('How much would you pay?')
          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('How much would you pay?')
            })
          }, 2000)
        }, 1000)

        return
      }
      if (feedbackText.toLowerCase().includes(' caro')) {
        setMessage('Entendi...')
        setTimeout(() => {
          setMessage('Quanto você pagaria?')
          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('Quanto você pagaria?')
            })
          }, 2000)
        }, 1000)

        return
      }

      setTimeout(() => {
        setMessage('Thanks for your feedback!')

        setTimeout(() => {
          setMessage('Join our Slack to get a response.')

          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('')
            })
          }, 8000)
        }, 2000)
      }, 1000)
    } catch (error) {
      console.error(error)
      bugsnag.notify(error)

      setMessage(`Failed to send feedback. Please contact us.`)

      setTimeout(() => {
        batch(() => {
          setMessage('')
          setFeedbackText('')
          setPlaceholder('')
        })
      }, 2000)
    }
  }

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        sharedStyles.horizontalAndVerticallyAligned,
        { height: quickFeedbackRowHeight },
      ]}
    >
      {message ? (
        message.toLowerCase().includes('slack') ? (
          <Link
            analyticsLabel="join_slack_after_feedback"
            enableUnderlineHover
            href={constants.DEVHUB_LINKS.SLACK_INVITATION}
            openOnNewTab
            textProps={{
              color: 'foregroundColorMuted65',
              style: [sharedStyles.flex, sharedStyles.textCenter],
            }}
            style={sharedStyles.flex}
          >
            {message}
          </Link>
        ) : (
          <ThemedText
            color="foregroundColorMuted65"
            style={[sharedStyles.flex, sharedStyles.textCenter]}
          >
            {message}
          </ThemedText>
        )
      ) : (
        <ThemedTextInput
          textInputKey="quick-feedback-text-input"
          onChangeText={text => {
            setFeedbackText(text)
          }}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder || 'Send quick feedback'}
          style={[sharedStyles.flex, sharedStyles.textCenter]}
        />
      )}
    </View>
  )
}
