// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView } from 'react-native';

import Column, { paddingHorizontal } from './Column';

const margin = 2;

const StyledView = styled.View`
  flex: 1;
`;

const StyledColumn = styled(Column)`
  flex: 1;
  width: ${() => Dimensions.get('window').width - (2 * paddingHorizontal)};
  margin: ${margin};
`;

export default class extends React.Component {
  state = {
    index: 0,
    marginLeft: 0,
  };

  render() {
    return (
      <ScrollView
        contentInset={{ left: paddingHorizontal }}
        contentOffset={{ x: paddingHorizontal }}
        contentContainerStyle={{ marginLeft: this.state.marginLeft }}
        loop={false}
        removeClippedSubviews={false}
        horizontal
        pagingEnabled
        scrollEventThrottle={30}
        onScroll={({ nativeEvent: { contentOffset: { x } } }) => {
          const index = x > 0 ? x / 375 : 0;
          
          const marginLeft = (
            (this.state.index * 2 * paddingHorizontal) -
            ((this.state.index - 1) * 2 * margin) +
            paddingHorizontal - 2 * margin
          );

          this.setState({ index, marginLeft });
        }}
        {...this.props}
      >
        <StyledView><StyledColumn title="React" /></StyledView>
        <StyledView><StyledColumn title="Redux" /></StyledView>
        <StyledView><StyledColumn title="GraphQL" /></StyledView>
        <StyledView><StyledColumn title="Node.js" /></StyledView>
        <StyledView><StyledColumn title="PHP" /></StyledView>
        <StyledView><StyledColumn title="PHP" /></StyledView>
        <StyledView><StyledColumn title="PHP" /></StyledView>
        <StyledView><StyledColumn title="PHP" /></StyledView>
        <StyledView><StyledColumn title="PHP" /></StyledView>
      </ScrollView>
    )
  }
}
