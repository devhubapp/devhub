// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import EventColumnsContainer from '../EventColumnsContainer';
import Screen from '../../components/Screen';
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
          <EventColumnsContainer />
        }
      </Screen>
    );
  }
}
