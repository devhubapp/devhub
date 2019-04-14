import useMultiKeyPressCallback from './use-multi-key-press-callback'

export default function useKeyPressCallback(
  targetKey: string,
  callback: () => void,
  { caseSensitive = false, preventDefault = true } = {},
) {
  useMultiKeyPressCallback([targetKey], callback, {
    caseSensitive,
    preventDefault,
  })
}
