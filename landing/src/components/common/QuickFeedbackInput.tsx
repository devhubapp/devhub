import { constants } from '@devhub/core'
import axios from 'axios'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { unstable_batchedUpdates as batch } from 'react-dom'

import { useAuth } from '../../context/AuthContext'
import { getDefaultDevHubHeaders } from '../../helpers'
import { useIsMountedRef } from '../../hooks/use-is-mounted-ref'
import { TextInput, TextInputProps } from './TextInput'

export interface QuickFeedbackInputProps extends TextInputProps {}

export const quickFeedbackRowHeight = 42

export function QuickFeedbackInput(props: QuickFeedbackInputProps) {
  const isMountedRef = useIsMountedRef()

  const [feedbackText, setFeedbackText] = useState('')
  const [message, setMessage] = useState<React.ReactNode>('')
  const [placeholder, setPlaceholder] = useState('')

  const {
    authData: { appToken },
  } = useAuth()

  async function trySendFeedback() {
    const response = await axios.post(
      `${constants.API_BASE_URL}/feedback`,
      {
        feedback: feedbackText || '',
        location: window.location.href || '',
      },
      { headers: getDefaultDevHubHeaders({ appToken }) },
    )

    if (!isMountedRef.current) return

    const { data, status } = await response

    if (status !== 200) {
      throw new Error(
        typeof data === 'string' ? data : 'Failed to send feedback.',
      )
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
          setMessage(
            <p
              className={classNames(
                'text-center text-muted-65',
                props.className,
              )}
              style={{ minWidth: 250 }}
            >
              Send via{' '}
              <a
                className="text-muted-65"
                href={`https://twitter.com/messages/compose?recipient_id=1013342195087224832&text=${encodeURIComponent(
                  feedbackText,
                )}`}
                target="_blank"
              >
                Twitter
              </a>{' '}
              or{' '}
              <a
                className="text-muted-65"
                href={constants.DEVHUB_LINKS.SLACK_INVITATION}
                target="_blank"
              >
                Slack
              </a>{' '}
              to get a response.
            </p>,
          )

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
      // bugsnag.notify(error)

      setMessage(`Failed to send feedback. Please contact us.`)

      setTimeout(() => {
        batch(() => {
          setMessage('')
          setFeedbackText('')
          setPlaceholder('')
        })
      }, 3000)
    }
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: quickFeedbackRowHeight }}
    >
      {message ? (
        typeof message === 'string' ? (
          <p
            className={classNames('text-center text-muted-65', props.className)}
            style={{ minWidth: 250 }}
          >
            {message}
          </p>
        ) : (
          message
        )
      ) : (
        <form
          onSubmit={e => {
            handleSubmit()
            e.preventDefault()
          }}
        >
          <TextInput
            {...props}
            className={classNames('text-center', props.className)}
            onChange={e => {
              setFeedbackText(e.target.value)
              if (props.onChange) props.onChange(e)
            }}
            placeholder={
              placeholder || props.placeholder || 'Send quick feedback'
            }
            style={{ minWidth: 250, ...props.style }}
          />
        </form>
      )}
    </div>
  )
}
