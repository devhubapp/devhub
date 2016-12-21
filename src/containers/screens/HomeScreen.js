// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import ColumnsContainer from '../ColumnsContainer';
import Screen from '../../components/Screen';
import debounce from '../../utils/hoc/debounce';
import { rehydratedSelector } from '../../selectors';
import type { State, ThemeObject } from '../../utils/types';

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const mapStateToProps = (state: State) => ({
  rehydrated: rehydratedSelector(state),
});

@connect(mapStateToProps)
@withTheme
@debounce(50)
export default class extends React.PureComponent {
  props: {
    rehydrated: boolean,
    theme: ThemeObject,
  };

  render() {
    const { rehydrated, theme } = this.props;

    return (
      <Screen>
        {
          !rehydrated && (
            <CenterView>
              <ActivityIndicator color={theme.base04} />
            </CenterView>
          )
        }

        {
          rehydrated &&
          <ColumnsContainer />
        }
      </Screen>
    );
  }
}
