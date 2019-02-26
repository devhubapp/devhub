import qs from 'qs'
import { findDOMNode } from 'react-dom'

import { constants } from '@devhub/core'
import { Platform } from '../../libs/platform'

export function findNode(ref: any) {
  let node = ref && (ref.current || ref)

  if (node && (node as any).getNode && (node as any).getNode())
    node = (node as any).getNode()

  if (node && (node as any)._touchableNode) node = (node as any)._touchableNode

  if (node && (node as any)._node) node = (node as any)._node

  if (node && Platform.OS === 'web') node = findDOMNode(node)

  return node
}

export function getGitHubAppInstallUri(
  options: {
    redirectUri?: string | undefined
    suggestedTargetId?: number | string | undefined
    repositoryIds?: Array<number | string> | undefined
  } = {},
) {
  const query: Record<string, any> = {}

  const redirectUri =
    options.redirectUri ||
    (Platform.OS === 'ios' || Platform.OS === 'android' || Platform.isElectron
      ? 'devhub://'
      : Platform.OS === 'web'
      ? window.location.origin
      : '')

  if (redirectUri) query.redirect_uri = redirectUri
  if (options.repositoryIds) query.repository_ids = options.repositoryIds
  if (options.suggestedTargetId)
    query.suggested_target_id = options.suggestedTargetId

  const querystring = qs.stringify(query, {
    arrayFormat: 'brackets',
    encode: false,
  })
  const baseUri = `${constants.API_BASE_URL}/github/app/install`

  return `${baseUri}${querystring ? `?${querystring}` : ''}`
}
