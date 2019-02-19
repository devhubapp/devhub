import useMultiKeyPressCallback from './use-multi-key-press-callback'

export default function useKeyPressCallback(
  targetKey: string,
  callback: () => void,
  preventDefault = true,
) {
  useMultiKeyPressCallback([targetKey], callback, preventDefault)
}
