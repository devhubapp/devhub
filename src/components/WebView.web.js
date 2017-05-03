// @flow
/* eslint-env browser */

import React from 'react'

export default ({ source: { uri } }, ...props) => (
  <iframe {...props} src={uri} />
)
