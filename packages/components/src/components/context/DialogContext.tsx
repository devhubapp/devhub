import React, { Fragment, useContext, useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { useDimensions } from '../../hooks/use-dimensions'
import { BlurView } from '../../libs/blur-view/BlurView'
import { Platform } from '../../libs/platform'
import { prompt } from '../../libs/prompt'
import { PromptButton } from '../../libs/prompt/index.shared'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, normalTextSize } from '../../styles/variables'
import { Button, ButtonProps } from '../common/Button'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Spacer } from '../common/Spacer'
import { TextInput } from '../common/TextInput'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export interface DialogProviderProps {
  children?: React.ReactNode
}

export interface DialogProviderState {
  show: (...params: Parameters<DialogViewInstance['show']>[0]) => void
  hide: () => void
}

const defaultValue: DialogProviderState = {
  show: () => {
    throw new Error('[DialogContext] Not initialized')
  },
  hide: () => {
    throw new Error('[DialogContext] Not initialized')
  },
}

export const DialogContext = React.createContext<DialogProviderState>(
  defaultValue,
)
DialogContext.displayName = 'DialogContext'

export function DialogProvider(props: DialogProviderProps) {
  const dialogRef = useRef<DialogViewInstance>(null)

  const value = useMemo<DialogProviderState>(
    () => ({
      show: (...params) => dialogRef.current!.show(params),
      hide: () => dialogRef.current!.hide(),
    }),
    [],
  )

  return (
    <DialogContext.Provider value={value}>
      {props.children}
      <DialogView ref={dialogRef} />
    </DialogContext.Provider>
  )
}

export const DialogConsumer = DialogContext.Consumer
;(DialogConsumer as any).displayName = 'DialogConsumer'

export function useDialog() {
  return useContext(DialogContext)
}

interface DialogViewInstance {
  show: (params: Parameters<typeof prompt>) => void
  hide: () => void
}

interface DialogViewProps {
  alignCenter?: boolean
}

const DialogView = React.memo(
  React.forwardRef<DialogViewInstance, DialogViewProps>((props, ref) => {
    const { alignCenter = Platform.realOS !== 'android' } = props

    const [promptArgs, setPromptArgs] = useState<Parameters<typeof prompt>>()
    const [inputValue, setInputValue] = useState<string>()
    const dimensions = useDimensions()

    const hide = () => {
      setPromptArgs(undefined)
      setInputValue(undefined)
    }

    React.useImperativeHandle(
      ref,
      () => ({
        show: setPromptArgs,
        hide,
      }),
      [],
    )

    const width = Math.min(
      dimensions.width * 0.8,
      dimensions.width - contentPadding * 2,
      400,
    )

    if (!(promptArgs && promptArgs.length)) return null

    const [title, message, _callbackOrButtons, options] = promptArgs

    const renderInput = !!(
      options &&
      options.type &&
      options.type !== 'default'
    )

    const callback =
      typeof _callbackOrButtons === 'function' ? _callbackOrButtons : undefined
    const buttons = Array.isArray(_callbackOrButtons)
      ? _callbackOrButtons
      : ([
          {
            text: 'Ok',
            onPress: callback
              ? () => {
                  callback(inputValue || '')
                  hide()
                }
              : undefined,
            style: 'default',
          },
          renderInput && {
            text: 'Cancel',
            onPress: callback
              ? () => {
                  callback('')
                  hide()
                }
              : undefined,
            style: 'cancel',
          },
        ].filter(Boolean) as PromptButton[])

    return (
      <TouchableWithoutFeedback
        onPress={
          options && options.cancelable === false
            ? undefined
            : () => {
                hide()
              }
        }
        style={sharedStyles.absoluteFill}
      >
        <BlurView intensity={8} style={sharedStyles.absoluteFill}>
          <ThemedView
            backgroundColor="backgroundColorDarker2"
            style={[sharedStyles.absoluteFill, { opacity: 0.8 }]}
          />

          <FullHeightScrollView
            contentContainerStyle={[
              sharedStyles.fullWidth,
              sharedStyles.fullHeight,
              sharedStyles.padding,
            ]}
            keyboardShouldPersistTaps={
              options && options.cancelable === false ? 'never' : 'handled'
            }
            style={sharedStyles.absoluteFill}
          >
            <KeyboardAvoidingView
              behavior="padding"
              style={[sharedStyles.flex, sharedStyles.center]}
            >
              <BlurView
                intensity={12}
                style={[sharedStyles.relative, { width, borderRadius: 14 }]}
              >
                <ThemedView
                  backgroundColor="backgroundColor"
                  style={[
                    sharedStyles.absoluteFill,
                    { opacity: 0.9, borderRadius: 14 },
                  ]}
                />

                <ThemedView
                  style={[
                    alignCenter
                      ? sharedStyles.alignItemsCenter
                      : sharedStyles.alignItemsFlexStart,
                    sharedStyles.paddingHorizontal,
                    {
                      width,
                      borderRadius: 14,
                    },
                  ]}
                >
                  <Spacer height={contentPadding} />

                  {!!title && (
                    <>
                      <ThemedText
                        color="foregroundColor"
                        style={[
                          alignCenter && sharedStyles.textCenter,
                          {
                            fontSize: normalTextSize + 4,
                            fontWeight: 'bold',
                          },
                        ]}
                      >
                        {title}
                      </ThemedText>

                      <Spacer height={contentPadding / 2} />
                    </>
                  )}

                  {!!message && (
                    <ThemedText
                      color="foregroundColor"
                      style={[
                        alignCenter && sharedStyles.textCenter,
                        { fontSize: normalTextSize },
                      ]}
                    >
                      {message}
                    </ThemedText>
                  )}

                  {!!(title || message) && <Spacer height={contentPadding} />}

                  {!!(renderInput && options) && (
                    <TextInput
                      textInputKey="dialog-text-input"
                      autoFocus
                      autoCompleteType={
                        options.type === 'login-password' ||
                        options.type === 'secure-text'
                          ? 'password'
                          : options.type === 'email-address'
                          ? 'email'
                          : undefined
                      }
                      defaultValue={options && options.defaultValue}
                      keyboardType={
                        options.type === 'login-password' ||
                        options.type === 'secure-text'
                          ? 'visible-password'
                          : options.type === 'plain-text'
                          ? 'default'
                          : options.type
                      }
                      onChangeText={setInputValue}
                      placeholder={options && options.placeholder}
                      secureTextEntry={
                        options && options.type === 'secure-text'
                      }
                      style={[
                        sharedStyles.fullWidth,
                        alignCenter && sharedStyles.textCenter,
                      ]}
                      value={inputValue}
                    />
                  )}

                  {!!(buttons && buttons.length) && (
                    <>
                      <Spacer height={contentPadding} />
                      {(() => {
                        let alreadyHasPrimaryButton = false

                        return buttons.map((button, index) => {
                          const buttonType: ButtonProps['type'] =
                            button.style === 'destructive'
                              ? 'danger'
                              : button.style === 'default' ||
                                (!button.style && !alreadyHasPrimaryButton)
                              ? ((): any => {
                                  alreadyHasPrimaryButton = true
                                  return 'primary'
                                })()
                              : 'neutral'
                          return (
                            <Fragment
                              key={`dialog-button-${button.text || index}`}
                            >
                              <Button
                                disabled={
                                  (!button.onPress &&
                                    button.style !== 'cancel') ||
                                  (buttonType === 'primary' &&
                                    renderInput &&
                                    !inputValue)
                                }
                                onPress={() => {
                                  if (button.onPress) {
                                    button.onPress(inputValue || '')
                                  }
                                  hide()
                                }}
                                style={sharedStyles.fullWidth}
                                textStyle={
                                  alignCenter
                                    ? [
                                        sharedStyles.alignSelfCenter,
                                        sharedStyles.textCenter,
                                      ]
                                    : [
                                        sharedStyles.alignSelfFlexStart,
                                        { textAlign: 'left' },
                                      ]
                                }
                                type={buttonType as any}
                              >
                                {button.text ||
                                  (button.style === 'cancel' ||
                                  button.style === 'destructive'
                                    ? 'Cancel'
                                    : 'Ok')}
                              </Button>

                              {index < buttons.length - 1 && (
                                <Spacer height={contentPadding / 2} />
                              )}
                            </Fragment>
                          )
                        })
                      })()}
                    </>
                  )}

                  <Spacer height={contentPadding} />
                </ThemedView>
              </BlurView>
            </KeyboardAvoidingView>
          </FullHeightScrollView>
        </BlurView>
      </TouchableWithoutFeedback>
    )
  }),
)
