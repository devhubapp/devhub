// @flow

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';

import { ColumnRoot } from './_Column';
import type { ActionCreators } from '../../utils/types';

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NewColumnButton = styled.TouchableOpacity`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

const NewColumnText = styled.Text`
  align-self: center;
  text-align: center;
  font-size: 20;
  color: ${({ theme }) => theme.base05};
`;

export default class extends React.PureComponent {

  props: {
    addColumnFn: Function,
    actions: ActionCreators,
    radius?: number,
    style?: ?Object,
  };

  render() {
    const { addColumnFn, ...props } = this.props;

    if (!addColumnFn) return null;

    return (
      <ColumnRoot {...props}>
        <Wrapper>
          <NewColumnButton onPress={addColumnFn}>
            <NewColumnText>
              <Icon name="plus" size={30} />{'\n'}
              add new column
            </NewColumnText>
          </NewColumnButton>
        </Wrapper>
      </ColumnRoot>
    );
  }
}
