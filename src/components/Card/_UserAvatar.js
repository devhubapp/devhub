// @flow

import React from 'react';
import gravatar from 'gravatar';

import Avatar from '../Avatar';

export default class extends React.PureComponent {
  props: {
    url: string,
    size?: ?number,
  } | {
    email?: ?string,
    size?: ?number,
  };

  render() {
    const { url, email, size, ...props } = this.props;

    if (!url && !email) return null;

    const sizeSteps = 50; // sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
    const steppedSize = sizeSteps * Math.max(1, Math.ceil(size / sizeSteps));
    const options = { size: steppedSize, d: 'retro' };
    const uri = url || `https:${gravatar.url(email, options)}`.replace('??', '?');

    return (
      <Avatar size={size} source={{ uri }} {...props} />
    );
  }
}
