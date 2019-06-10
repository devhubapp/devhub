import qs from 'qs'
import { findDOMNode } from 'react-dom'

import { constants } from '@devhub/core'
import {
  AppLayoutProviderState,
  getLayoutConsumerState,
} from '../../components/context/LayoutContext'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'

export function findNode(ref: any) {
  try {
    let node = ref && (ref.current || ref)

    if (node && (node as any).getNode && (node as any).getNode())
      node = (node as any).getNode()

    if (node && (node as any)._touchableNode)
      node = (node as any)._touchableNode

    if (node && (node as any)._node) node = (node as any)._node

    if (node && Platform.OS === 'web') node = findDOMNode(node)

    return node
  } catch (error) {
    console.error('Failed to find node', error, { ref })
    return null
  }
}

export function tryFocus(ref: any) {
  const node = findNode(ref)

  if (node && node.focus) {
    if (!(node.tabIndex >= 0)) node.tabIndex = -1
    node.focus()
    return true
  }

  return false
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

export async function openAppStore() {
  try {
    if (Platform.realOS === 'android') {
      let storeUrl = `market://details?id=${constants.GOOGLEPLAY_ID}`

      if (Platform.OS === 'android' && (await Linking.canOpenURL(storeUrl))) {
        if (__DEV__) console.log(`Requested to open Play Store: ${storeUrl}`) // tslint:disable-line no-console
        await Linking.openURL(storeUrl)
        return true
      }

      storeUrl = `https://play.google.com/store/apps/details?id=${
        constants.GOOGLEPLAY_ID
      }`
      if (__DEV__) console.log(`Requested to open Play Store: ${storeUrl}`) // tslint:disable-line no-console
      await Browser.openURL(storeUrl)
      return true
    }

    if (Platform.realOS === 'ios') {
      let storeUrl = `itms-apps://itunes.apple.com/app/id${
        constants.APPSTORE_ID
      }`

      if (Platform.OS === 'ios' && (await Linking.canOpenURL(storeUrl))) {
        if (__DEV__) console.log(`Requested to open App Store: ${storeUrl}`) // tslint:disable-line no-console
        await Linking.openURL(storeUrl)
        return true
      }

      storeUrl = `https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${
        constants.APPSTORE_ID
      }&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8`
      if (__DEV__) console.log(`Requested to open App Store: ${storeUrl}`) // tslint:disable-line no-console
      await Browser.openURL(storeUrl)
      return true
    }

    throw new Error(`Invalid platform: ${Platform.realOS}`)
  } catch (error) {
    if (__DEV__) console.error(`Failed to open App Store: ${error}`) // tslint:disable-line no-console
    return false
  }
}

export function genericParseText<T extends string>(
  text: string,
  pattern: RegExp,
  fn: (match: T) => React.ReactNode,
) {
  if (!(text && typeof text === 'string')) return [text].filter(Boolean)

  const matches = text.match(new RegExp(pattern, 'g')) as T[]
  if (!(matches && matches.length)) return [text].filter(Boolean)

  return text.split(pattern).reduce(
    (result, item, index) => {
      if (!matches[index]) return result.concat([item].filter(Boolean))

      return result.concat([item, fn(matches[index])].filter(Boolean))
    },
    [] as React.ReactNode[],
  )
}

export function isBigEnoughForMultiColumnView(
  sizename?: AppLayoutProviderState['sizename'],
) {
  return (sizename || getLayoutConsumerState().sizename) >= '2-medium'
}
