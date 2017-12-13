import gravatar from 'gravatar'

import { getSteppedSize } from './shared'

export function getUserAvatarByUsername(username: string, { size }: { size?: number } = {}) {
  return username ? `https://github.com/${username}.png?size=${getSteppedSize(size)}` : ''
}

export function tryGetUsernameFromGithubEmail(email: string) {
  if (!email) return ''

  const emailSplit = email.split('@')
  if (emailSplit.length === 2 && emailSplit[1] === 'users.noreply.github.com') return emailSplit[0]

  return ''
}

export function getUserAvatarByEmail(
  email: string,
  { size, ...otherOptions }: { size?: number } = {},
) {
  const steppedSize = getSteppedSize(size)
  const username = tryGetUsernameFromGithubEmail(email)
  if (username) return getUserAvatarByUsername(username, { size: steppedSize })

  const options = { size: `${steppedSize || ''}`, d: 'retro', ...otherOptions }
  return `https:${gravatar.url(email, options)}`.replace('??', '?')
}
