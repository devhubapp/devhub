import { findDOMNode } from 'react-dom'

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
