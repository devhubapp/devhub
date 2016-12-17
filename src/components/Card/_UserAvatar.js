// @flow

import React from 'react';

import Avatar from '../Avatar';
import { getUserAvatarByEmail } from '../../utils/helpers/github';

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

    const uri = url || getUserAvatarByEmail(email, { size });
    if (!uri) return null;

    return (
      <Avatar size={size} source={{ uri }} {...props} />
    );
  }
}
