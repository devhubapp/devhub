// @flow

import React from 'react';

import Icon from '../../libs/icon';
import TouchableRow from './__TouchableRow';

import { StyledText } from './__CardComponents';

import { trimNewLinesAndSpaces } from '../../utils/helpers';

export default class extends React.PureComponent {
  props: {
    narrow?: boolean,
    page: Object,
    read?: boolean,
    title: string,
  };

  render() {
    const { page, read, ...props } = this.props;

    if (!page) return null;

    const title = trimNewLinesAndSpaces(
      page.get('title') || page.get('page_name'),
    );
    if (!title) return null;

    return (
      <TouchableRow
        read={read}
        url={page.get('html_url') || page.get('url')}
        {...props}
      >
        <StyledText numberOfLines={1} muted={read}>
          <StyledText muted={read}><Icon name="book" />&nbsp;</StyledText>
          {title}
        </StyledText>
      </TouchableRow>
    );
  }
}
