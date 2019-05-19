import useMultiKeyPressCallback from './use-multi-key-press-callback'

export default function useKeyPressCallback(
  targetKey: string,
  callback: () => void,
  options: Parameters<typeof useMultiKeyPressCallback>[2] = {},
) {
  useMultiKeyPressCallback([targetKey], callback, options)
}
