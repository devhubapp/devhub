// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import TouchableRow from './__TouchableRow';

import {
  StyledText,
} from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';

export default class extends React.PureComponent {
  props: {
    narrow?: boolean,
    title: string,
  };

  render() {
    const { page, ...props } = this.props;

    if (!page) return null;

    const title = trimNewLinesAndSpaces(page.get('title') || page.get('page_name'));
    if (!title) return null;

    return (
      <TouchableRow
        url={page.get('html_url') || page.get('url')}
        {...props}
      >
        <StyledText numberOfLines={1}>
          <Icon name="book" />&nbsp;
          {title}
        </StyledText>
      </TouchableRow>
    );
  }
}
