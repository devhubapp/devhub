import React, {
  Fragment,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { KeyboardAvoidingView } from 'react-native'

import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { BlurView } from '../../libs/blur-view/BlurView'
import { Platform } from '../../libs/platform'
import { prompt } from '../../libs/prompt'
import { PromptButton } from '../../libs/prompt/index.shared'
import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
} from '../../styles/variables'
import { Button, ButtonProps } from '../common/Button'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Spacer } from '../common/Spacer'
import { TextInput } from '../common/TextInput'
import { ThemedText } from '../themed/ThemedText'
import { ThemedTouchableWithoutFeedback } from '../themed/ThemedTouchableWithoutFeedback'
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

export interface DialogViewInstance {
  show: (params: Parameters<typeof prompt>) => void
  hide: () => void
  setDimensions: (dimensions: { width: number; height: number }) => void
}

export interface DialogViewProps {
  alignCenter?: boolean
}

const DialogView = React.memo(
  React.forwardRef<DialogViewInstance, DialogViewProps>((props, ref) => {
    const { alignCenter = Platform.realOS !== 'android' } = props

    const [promptArgs, setPromptArgs] = useState<
      Parameters<typeof prompt> | undefined
    >()
    const [inputValue, setInputValue] = useState<string>()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    const hide = useCallback(() => {
      setPromptArgs(undefined)
      setInputValue(undefined)
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        show: setPromptArgs,
        hide,
        setDimensions,
      }),
      [],
    )

    useKeyPressCallback(
      'Escape',
      useCallback(() => {
        hide()
      }, [hide]),
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
            onPress: () => {
              if (callback) callback(inputValue || '')
              hide()
            },
            style: 'default',
          },
          renderInput &&
            !(options && options.cancelable === false) && {
              text: 'Cancel',
              onPress: () => {
                if (callback) callback('')
                hide()
              },
              style: 'cancel',
            },
        ].filter(Boolean) as PromptButton[])

    return (
      <BlurView
        intensity={8}
        style={[
          sharedStyles.absoluteFill,
          !(dimensions.width && dimensions.height) && sharedStyles.opacity0,
        ]}
      >
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
          <>
            <ThemedTouchableWithoutFeedback
              backgroundColor="backgroundColorDarker2"
              onLayout={e => {
                setDimensions({
                  width: e.nativeEvent.layout.width,
                  height: e.nativeEvent.layout.height,
                })
              }}
              onPress={
                options && options.cancelable === false
                  ? undefined
                  : () => {
                      hide()
                    }
              }
              style={[sharedStyles.absoluteFill, { opacity: 0.8 }]}
            />

            <KeyboardAvoidingView
              behavior="padding"
              style={[sharedStyles.flex, sharedStyles.center]}
              pointerEvents="box-none"
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
                            fontSize: normalTextSize + 4 * scaleFactor,
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
                      blurOnSubmit
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
                      onSubmitEditing={() => {
                        if (!inputValue) return

                        const submitButton = buttons.find(
                          button =>
                            button &&
                            button.onPress &&
                            (!button.style || button.style === 'default'),
                        )
                        if (submitButton && submitButton.onPress) {
                          submitButton.onPress(inputValue)
                          hide()
                        }
                      }}
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

                          const disabled =
                            (!button.onPress && button.style !== 'cancel') ||
                            (buttonType === 'primary' &&
                              renderInput &&
                              !inputValue)

                          return (
                            <Fragment
                              key={`dialog-button-${button.text || index}`}
                            >
                              <Button
                                autoFocus={
                                  buttonType === 'primary' && !disabled
                                }
                                disabled={disabled}
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
          </>
        </FullHeightScrollView>
      </BlurView>
    )
  }),
)
