// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { RefreshControl } from 'react-native';

import Column, { getRadius, getWidth } from './_Column';
import ProgressBar from '../ProgressBar';
import StatusMessage from '../StatusMessage';
import TransparentTextOverlay from '../TransparentTextOverlay';
import withOrientation from '../../hoc/withOrientation';
import { iconRightMargin } from '../cards/__CardComponents';
import { contentPadding } from '../../styles/variables';
import type { Subscription, ThemeObject } from '../../utils/types';

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
  line-height: 18;
  font-size: 18;
  font-weight: 500;
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

@withOrientation
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
    width?: number,
  };

  render() {
    const {
      errors,
      headerRight,
      icon,
      items,
      loading,
      renderRow,
      refreshFn,
      refreshText,
      theme,
      title,
      ...props
    } = this.props;

    const _radius = getRadius(props);

    return (
      <Column {...props}>
        <FixedHeader>
          <TitleWrapper>
            <Title numberOfLines={1} style={{ maxWidth: 280 }}>
              <Icon name={icon} size={18} />&nbsp;{title}
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
            <StatusMessage key={`error-${error}`} message={error} error />
          ))
        }

        <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={_radius}>
          <StyledImmutableListView
            immutableData={items}
            initialListSize={5}
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
      </Column>
    );
  }
}
