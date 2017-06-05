// @flow

import React from 'react'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

import Octicon from '../../libs/icon'

import ScrollableContentContainer from '../ScrollableContentContainer'
import {
  avatarWidth,
  contentPadding,
  radius,
  smallAvatarWidth,
  mutedOpacity,
} from '../../styles/variables'

import { openOnGithub } from '../../utils/helpers/github/url'

export { avatarWidth, smallAvatarWidth }
export const innerContentPadding = contentPadding
export const narrowInnerContentPadding = innerContentPadding / 2
export const iconRightMargin = 0 // contentPadding - 2;

export const CardWrapper = styled.View`
  padding: ${contentPadding}px;
  border-width: 0px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.base01};
  opacity: ${({ muted }) => (muted ? mutedOpacity : 1)};
`

export const FullView = styled.View`
  flex: 1;
  alignSelf: stretch;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
`

export const FullAbsoluteView = styled.View`
  position: absolute;
  top: ${({ top }) => top || 0}px;
  bottom: ${({ bottom }) => bottom || 0}px;
  left: ${({ left }) => left || 0}px;
  right: ${({ right }) => right || 0}px;
  ${({ width }) => (width ? `width: ${width}px;` : '')}
  ${({ height }) => (height ? `height: ${height}px;` : '')}
  ${({ zIndex }) => (zIndex ? `z-index: ${zIndex};` : '')}
`

// export const RowSeparator = styled.View`
//   flexGrow: 1;
//   height: ${({ narrow }) => (narrow ? narrowInnerContentPadding : innerContentPadding)}px;
// `;

export const HorizontalView = styled.View`
  flex-direction: row;
`

export const RepositoryContentContainer = styled(ScrollableContentContainer)`
  padding-horizontal: ${contentPadding}px;
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
`

export const LeftColumn = styled.View`
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
  align-items: flex-end;
  justify-content: flex-start;
  width: ${avatarWidth};
  margin-right: ${contentPadding};
`
// opacity: ${({ muted }) => (muted ? mutedOpacity : 1)};

export const MainColumn = styled.View`
  flex: 1;
  justify-content: center;
`

export const MainColumnRowContent = MainColumn.extend`
  flex-direction: row;
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
`

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`

export const StyledText = styled.Text`
  background-color: transparent;
  color: ${({ color, muted, read, theme }) =>
    muted && read !== false
      ? theme.base05
      : (color && (theme[color] || color)) || theme.base04};
  line-height: 20px;
  font-size: ${({ small }) => (small ? 12 : 14)}px;
  font-weight: ${({ read }) => (read === false ? 'bold' : 'normal')};
`

export const SmallText = StyledText.extend`
  font-size: 12px;
`

export const OwnerLogin = StyledText.extend`
  font-weight: bold;
`

export const RepositoryName = StyledText.extend`
`

export const CardText = StyledText.extend`
  flex: 1;
  font-size: 14px;
  ${Platform.select({ web: { wordBreak: 'break-all' } })}
`

export const ContentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${({ narrow }) =>
    narrow ? narrowInnerContentPadding : innerContentPadding};
`

export const HighlightContainerBase = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.base01};
  border-radius: ${radius}px;
`

export const HighlightContainer1 = HighlightContainerBase.extend`
  background-color: ${({ theme }) => theme.base01};
`

export const HighlightContainer2 = HighlightContainerBase.extend`
  background-color: ${({ theme }) => theme.base03};
`

export const HighlightContainerRow1 = HighlightContainer1.extend`
  min-height: 30px;
`

export const ItemIdContainer = HighlightContainer2.extend`
  padding-horizontal: 4px;
`

export const ItemId = StyledText.extend`
  font-weight: bold;
  font-size: 12px;
  opacity: 0.9;
`

export const RightOfScrollableContent = styled.View`
  margin-right: ${contentPadding}px;
`

export const Icon = styled(Octicon)`
  background-color: transparent;
  color: ${({ color, muted, theme }) =>
    (color && (theme[color] || color)) ||
    (muted ? theme.base05 : theme.base06)};
  opacity: ${({ color, muted }) => (color && muted ? mutedOpacity : 1)};
`

export const CardIcon = Icon.extend`
  align-self: flex-start;
  margin-left: ${contentPadding}px;
  margin-right: ${iconRightMargin}px;
  font-size: 18px;
`

type ItemIdProps = {
  icon?: string,
  number: number,
  read?: boolean,
  url: string,
}
export const CardItemId = ({ icon, number, read, url }: ItemIdProps) => {
  if (!number && !icon) return null

  const parsedNumber = parseInt(number, 10) || number

  return (
    <ItemIdContainer>
      <ItemId onPress={url ? () => openOnGithub(url) : null} muted={read}>
        {icon ? <Icon name={icon} /> : ''}
        {parsedNumber && icon ? ' ' : ''}
        {typeof parsedNumber === 'number' ? '#' : ''}
        {parsedNumber}
      </ItemId>
    </ItemIdContainer>
  )
}

CardItemId.defaultProps = {
  icon: undefined,
  read: undefined,
}
