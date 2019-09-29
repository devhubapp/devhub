import useMultiKeyPressCallback from './use-multi-key-press-callback'

export default function useKeyPressCallback(
  targetKey: string | undefined,
  onPress: () => void,
  onRelease?: () => void,
  options: Parameters<typeof useMultiKeyPressCallback>[3] = {},
) {
  useMultiKeyPressCallback(
    targetKey ? [targetKey] : [],
    onPress,
    onRelease,
    options,
  )
}
