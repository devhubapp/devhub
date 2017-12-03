// @flow
/* eslint-env browser */

import React from 'react'

type Props = {
  source: { uri: string }, // eslint-disable-line react/no-unused-prop-types
  title: string,
}

const WebView = ({ source: { uri }, title }: Props, ...props) => (
  <iframe {...props} src={uri} title={title} />
)

export default WebView
