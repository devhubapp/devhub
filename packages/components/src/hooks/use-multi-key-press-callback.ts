import { useCallback, useEffect, useRef } from 'react'

import { emitter } from '../libs/emitter'
import { useEmitter } from './use-emitter'
import { getLastUsedInputType } from './use-last-input-type'

export default function useMultiKeyPressCallback(
  targetKeys: string[],
  onPress: () => void,
  onRelease?: () => void,
  { caseSensitive = false, preventDefault = true } = {},
) {
  const pressedKeysRef = useRef(new Set<string>([]))
  const params = useRef({
    targetKeys: [] as string[],
    onPress: (() => undefined) as () => void,
    onRelease: (() => undefined) as (() => void) | undefined,
    preventDefault: true,
  })
  const timeoutRef = useRef<any>(0)
  const calledOnPressRef = useRef(false)

  // clear all keys after some seconds without pressing any key
  // this is a workaround to fix the keyup event not being called sometimes
  // which would cause a key to be stuck at the pressedKeys cache
  // and fail other combo attempts
  function pingKeyPressed() {
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      pressedKeysRef.current.clear()
    }, 5000)
  }

  useEffect(() => {
    params.current = { targetKeys, onPress, onRelease, preventDefault }
  }, [targetKeys.join(','), onPress, onRelease, preventDefault])

  const downHandler = useCallback(
    (e: KeyboardEvent) => {
      pingKeyPressed()

      if (pressedKeysRef.current.has(e.key)) return

      pressedKeysRef.current.add(e.key)
      const hasPressedCombo = areKeysPressed(
        params.current.targetKeys,
        Array.from(pressedKeysRef.current),
        caseSensitive,
      )

      if (hasPressedCombo) {
        if (params.current.preventDefault) e.preventDefault()

        calledOnPressRef.current = true
        params.current.onPress()

        const keys = Array.from(pressedKeysRef.current)
        setTimeout(() => {
          emitter.emit('PRESSED_KEYBOARD_SHORTCUT', {
            keys,
          })

          const currentFocusedNodeTag =
            typeof document !== 'undefined' &&
            document &&
            document.activeElement &&
            document.activeElement.tagName
          if (
            !(
              currentFocusedNodeTag &&
              currentFocusedNodeTag.toLowerCase() === 'input'
            )
          ) {
            if (
              getLastUsedInputType() !== 'keyboard' &&
              keys.some(
                (key) => !['Alt', 'Ctrl', 'Meta', 'Shift'].includes(key),
              )
            ) {
              emitter.emit('SET_LAST_INPUT_TYPE', { type: 'keyboard' })
            }
          }
        }, 10)
      }
    },
    [caseSensitive],
  )

  const upHandler = useCallback((e: KeyboardEvent) => {
    pingKeyPressed()

    pressedKeysRef.current.delete(e.key)

    if (calledOnPressRef.current) {
      calledOnPressRef.current = false
      if (params.current.onRelease) params.current.onRelease()
    }
  }, [])

  useEffect(() => {
    if (!(window && typeof window.addEventListener === 'function')) return
    if (!targetKeys.length) return

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [downHandler, upHandler, targetKeys.length])

  useEmitter(
    targetKeys.length ? 'PRESSED_KEYBOARD_SHORTCUT' : undefined,
    (payload) => {
      if (
        payload.keys.length === 1 &&
        !['Alt', 'Ctrl', 'Meta', 'Shift'].includes(payload.keys[0])
      ) {
        pressedKeysRef.current.clear()
      }
    },
    [],
  )
}

function areKeysPressed(
  keys: string[] = [],
  pressedKeys: string[] = [],
  caseSensitive?: boolean,
) {
  if (keys.length !== pressedKeys.length) return false

  const _keys = caseSensitive ? keys : keys.map((k) => `${k}`.toUpperCase())
  const _pressedKeys = caseSensitive
    ? pressedKeys
    : pressedKeys.map((k) => `${k}`.toUpperCase())

  const keysToCheck = new Set(_keys)
  _pressedKeys.forEach((key) => {
    keysToCheck.delete(key)
  })

  return keysToCheck.size === 0
}
