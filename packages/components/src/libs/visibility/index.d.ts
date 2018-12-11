export function isSupported(): boolean
export function isVisible(): boolean
export function addEventListener(
  callback: (isVisible: boolean | null) => void,
): void
export function removeEventListener(
  callback: (isVisible: boolean | null) => void,
): void
