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

    const roundedSize = 100 * Math.max(1, Math.ceil(size / 100));
    const uri = url || `https:${gravatar.url(email, { size: roundedSize })}`.replace('??', '?');

    return (
      <Avatar size={size} source={{ uri }} {...props} />
    );
  }
}
