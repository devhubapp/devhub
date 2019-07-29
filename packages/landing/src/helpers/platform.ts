function getOSName() {
  const userAgent =
    typeof navigator === 'undefined' || typeof window === 'undefined'
      ? ''
      : navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) return 'android'

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'

  return 'web'
}

const realOS = getOSName()

export const Platform = {
  realOS,
}
