/* eslint-env browser */

import React, { PropTypes, PureComponent } from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Platform } from 'react-native';

const getBackgroundColorFromProps = ({ backgroundColor, theme }) =>
  backgroundColor || (theme || {}).base00;

const Screen = styled.View`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? 22 : 0};
  background-color: ${getBackgroundColorFromProps};
`;

@withTheme
class WebScreen extends PureComponent {
  static defaultProps = {
    backgroundColor: undefined,
  }

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    backgroundColor: PropTypes.string,
    theme: PropTypes.shape({ base00: PropTypes.string }).isRequired,
  }
  /* eslint-enable */

  componentDidMount() {
    this.updateBodyBackgroundColor(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateBodyBackgroundColor(props);
  }

  updateBodyBackgroundColor = (props) => {
    const backgroundColor = getBackgroundColorFromProps(props);
    if (backgroundColor) document.body.bgColor = backgroundColor;
  }

  render() {
    return <Screen {...this.props} />;
  }
}

export default Platform.OS === 'web' ? WebScreen : Screen;
