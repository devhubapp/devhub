// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { Dimensions, RefreshControl } from 'react-native';

import ProgressBar from '../ProgressBar';
import StatusMessage from '../StatusMessage';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { iconRightMargin } from '../cards/__CardComponents';
import { contentPadding, radius as defaultRadius } from '../../styles/variables';
import type { Subscription, ThemeObject } from '../../utils/types';

export const columnMargin = 2;
export const columnPreviewWidth = contentPadding;
export const getFullWidth = () => Dimensions.get('window').width;
export const getWidth = () => getFullWidth() - (2 * columnPreviewWidth);

export const ColumnWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: ${getWidth};
`;

export const ColumnRoot = styled.View`
  flex: 1;
  align-self: stretch;
  margin-horizontal: ${columnMargin}
  margin-vertical: ${columnMargin};
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

export const StyledTextOverlay = styled(TransparentTextOverlay) `
  flex: 1;
  border-radius: ${({ radius }) => radius || 0};
`;

export const HeaderButtonsContainer = styled.View`
  flex-direction: row;
  padding-right: ${iconRightMargin};
`;

export const TitleWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const Title = styled.Text`
  padding: ${contentPadding};
  padding-top: ${contentPadding + 4};
  line-height: 20;
  font-size: 20;
  font-weight: 600;
  color: ${({ theme }) => theme.base04};
  background-color: transparent;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding-vertical: ${contentPadding};
  padding-horizontal: ${contentPadding};
`;

export const HeaderButtonText = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.base04};
`;

export const FixedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: ${20 + (2 * contentPadding)};
`;

export const ProgressBarContainer = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.base01};
`;

export const StyledImmutableListView = styled(ImmutableListView)`
  flex: 1;
  overflow: hidden;
`;

@withTheme
export default class extends React.PureComponent {
  props: {
    errors?: ?Array<string>,
    headerRight?: React.Element,
    icon: string,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    refreshFn?: Function,
    refreshText?: string,
    renderRow: Function,
    style?: ?Object,
    seenIds: Array<string>,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
    title: string,
  };

  render() {
    const {
      errors,
      headerRight,
      icon,
      items,
      loading,
      radius: receivedRadius,
      renderRow,
      refreshFn,
      refreshText,
      theme,
      title,
      ...props
    } = this.props;

    const radius = typeof receivedRadius === 'undefined' ? defaultRadius: receivedRadius;

    return (
      <ColumnWrapper>
        <ColumnRoot radius={radius} {...props}>
          <FixedHeader>
            <TitleWrapper>
              <Title numberOfLines={1} style={{ maxWidth: 280 }}>
                <Icon name={icon} size={20} />&nbsp;{title}
              </Title>
            </TitleWrapper>

            {headerRight}
          </FixedHeader>

          <ProgressBarContainer>
            {
              loading &&
              <ProgressBar
                width={getWidth()}
                height={1}
                indeterminate
              />
            }
          </ProgressBarContainer>

          {
            errors && errors.map(error => (
              <StatusMessage message={error} error />
            ))
          }

          <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={radius}>
            <StyledImmutableListView
              immutableData={items}
              initialListSize={5}
              rowsDuringInteraction={5}
              renderRow={renderRow}
              refreshControl={
                refreshFn &&
                <RefreshControl
                  refreshing={false}
                  onRefresh={refreshFn}
                  colors={[loading ? 'transparent' : theme.base08]}
                  tintColor={loading ? 'transparent' : theme.base08}
                  title={(refreshText || ' ').toLowerCase()}
                  titleColor={theme.base05}
                  progressBackgroundColor={theme.base02}
                />
              }
              contentContainerStyle={{ overflow: 'hidden' }}
              removeClippedSubviews
            />
          </StyledTextOverlay>
        </ColumnRoot>
      </ColumnWrapper>
    );
  }
}
