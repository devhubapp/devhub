// @flow
/* eslint-env browser */

import React from 'react'

type Props = {
  source: { uri: string }, // eslint-disable-line react/no-unused-prop-types
}

const WebView = ({ source: { uri } }: Props, ...props) => (
  <iframe {...props} src={uri} />
)

export default WebView
