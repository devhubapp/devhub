// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

import ScrollableContentContainer from '../ScrollableContentContainer';
import { avatarWidth, contentPadding, radius } from '../../styles/variables';

export const smallAvatarWidth = avatarWidth / 2;
export const innerContentPadding = contentPadding;
export const narrowInnerContentPadding = innerContentPadding / 2;
export const iconRightMargin = contentPadding - 2;

export const CardWrapper = styled.View`
  padding: ${contentPadding};
  border-width: 0;
  border-bottom-width: 1;
  border-color: ${({ theme }) => theme.base01};
  opacity: ${({ seen }) => (seen ? 0.25 : 1)};
`;

export const FullView = styled.View`
  flex: 1;
`;

export const FullAbsoluteView = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${({ zIndex }) => (zIndex ? `z-index: ${zIndex};` : '')}
`;

// export const RowSeparator = styled.View`
//   flexGrow: 1;
//   height: ${({ narrow }) => (narrow ? narrowInnerContentPadding : innerContentPadding)};
// `;

export const HorizontalView = styled.View`
  flex-direction: row;
`;

export const RepositoryContentContainer = styled(ScrollableContentContainer)`
  padding-horizontal: ${contentPadding};
`;

export const Header = styled(HorizontalView)`
  align-items: center;
`;

export const LeftColumn = styled.View`
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
  align-items: flex-end;
  justify-content: flex-start;
  width: ${avatarWidth};
  margin-right: ${contentPadding};
`;

export const MainColumn = styled.View`
  flex: 1;
  justify-content: center;
`;

export const MainColumnRowContent = styled(MainColumn)`
  flex-direction: row;
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
`;

export const HeaderRow = styled(HorizontalView)`
  align-items: flex-start;
  justify-content: space-between;
`;

export const Text = styled.Text`
  color: ${({ muted, theme }) => (muted ? theme.base05 : theme.base04)};
  line-height: 18;
  font-size: ${({ small }) => small ? 12 : 14};
`;

export const SmallText = styled(Text)`
  font-size: 12;
`;

export const Username = styled(Text)`
  font-weight: bold;
`;

export const RepositoryName = styled(Text)`
`;

export const CardItemId = styled(Text)`
  font-weight: bold;
  font-size: 12;
  opacity: 0.9;
`;

export const CardText = styled(Text)`
  flex: 1;
  font-size: 14;
`;

export const ContentRow = styled(HorizontalView)`
  align-items: flex-start;
  margin-top: ${({ narrow }) => (narrow ? narrowInnerContentPadding : innerContentPadding)};
`;

export const HighlightContainerBase = styled(HorizontalView)`
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.base01};
  border-radius: ${radius};
`;

export const HighlightContainer1 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base01};
`;

export const HighlightContainer2 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base03};
`;

export const HighlightContainerRow1 = styled(HighlightContainer1)`
  min-height: 30;
`;

export const CardItemIdContainer = styled(HighlightContainer2)`
  padding-horizontal: 4;
`;

export const RightOfScrollableContent = styled.View`
  margin-right: ${contentPadding};
`;

export const CardIcon = styled(Icon)`
  align-self: flex-start;
  margin-left: ${contentPadding};
  margin-right: ${iconRightMargin};
  font-size: 20;
  color: ${({ color, theme }) => color || theme.base05};
  background-color: transparent;
`;

export const renderItemId = (number, icon) => {
  if (!number && !icon) return null;

  return (
    <CardItemIdContainer>
      <CardItemId>
        {icon ? <Icon name={icon} /> : ''}
        {number && icon ? ' ' : ''}
        {typeof number === 'number' ? '#' : ''}
        {number}
      </CardItemId>
    </CardItemIdContainer>
  );
};
