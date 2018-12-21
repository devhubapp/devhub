import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

export type KeyboardVisibility = 'appearing' | 'visible' | 'hiding' | 'hidden'

export function useKeyboardVisibility() {
  const [visibility, setVisibility] = useState<KeyboardVisibility>('hidden')

  useEffect(
    () => {
      const handleWillShow = () => {
        setVisibility('appearing')
      }

      const handleDidShow = () => {
        setVisibility('visible')
      }

      const handleWillHide = () => {
        setVisibility('hiding')
      }

      const handleDidHide = () => {
        setVisibility('hidden')
      }

      Keyboard.addListener('keyboardWillShow', handleWillShow)
      Keyboard.addListener('keyboardDidShow', handleDidShow)
      Keyboard.addListener('keyboardWillHide', handleWillHide)
      Keyboard.addListener('keyboardDidHide', handleDidHide)

      return () => {
        Keyboard.removeListener('keyboardWillShow', handleWillShow)
        Keyboard.removeListener('keyboardDidShow', handleDidShow)
        Keyboard.removeListener('keyboardWillHide', handleWillHide)
        Keyboard.removeListener('keyboardDidHide', handleDidHide)
      }
    },
    [visibility],
  )

  return visibility
}
