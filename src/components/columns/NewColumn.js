// @flow

import React from 'react';
import styled from 'styled-components/native';

import Column from './_Column';
import Icon from '../../libs/icon';
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

const NewColumnIcon = styled(Icon)`
  font-size: 22px;
`;

const NewColumnText = styled.Text`
  align-self: center;
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.base05};
`;

export default class extends React.PureComponent {
  props: {
    addColumnFn: Function,
    actions: ActionCreators,
    style?: ?Object,
  };

  render() {
    const { addColumnFn, ...props } = this.props;

    if (!addColumnFn) return null;

    return (
      <Column {...props}>
        <Wrapper>
          <NewColumnButton onPress={addColumnFn}>
            <NewColumnText>
              <NewColumnIcon name="plus" />{'\n'}
              add new column
            </NewColumnText>
          </NewColumnButton>
        </Wrapper>
      </Column>
    );
  }
}
