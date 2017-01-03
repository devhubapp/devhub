// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native';

import Avatar from '../Avatar';
import { getUserAvatarByEmail, openOnGithub } from '../../utils/helpers/github';

export default class extends React.PureComponent {
  props: {
    linkURL: string,
    size?: ?number,
  } & ({
    avatarURL: string,
  } | {
    email?: ?string,
  });

  render() {
    const { avatarURL, email, linkURL, size, ...props } = this.props;

    const uri = avatarURL || getUserAvatarByEmail(email, { size });
    if (!uri) return null;

    return (
      <TouchableOpacity onPress={() => openOnGithub(linkURL)}>
        <Avatar size={size} source={{ uri }} {...props} />
      </TouchableOpacity>
    );
  }
}
