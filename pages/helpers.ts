export function aspectRatioToStyle(ratio: number) {
  return {
    width: '100%',
    paddingTop: `${(100 * ratio).toFixed(2)}%`,
  }
}
