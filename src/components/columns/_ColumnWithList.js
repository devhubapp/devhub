// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { RefreshControl } from 'react-native';

import ColumnWithHeader, { getRadius, getWidth } from './_ColumnWithHeader';
import ProgressBar from '../ProgressBar';
import StatusMessage from '../StatusMessage';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { iconRightMargin } from '../cards/__CardComponents';
import { contentPadding } from '../../styles/variables';
import type { Subscription, ThemeObject } from '../../utils/types';

export * from './_ColumnWithHeader';

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

const headerFontSize = 18;
export const Title = styled.Text`
  padding: ${contentPadding};
  padding-top: ${contentPadding + 4};
  line-height: ${headerFontSize};
  font-size: ${headerFontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.base04};
  background-color: transparent;
`;

export const TitleIcon = styled(Icon)`
  font-size: ${headerFontSize};
`;

export const HeaderButton = styled.TouchableOpacity`
  padding-vertical: ${contentPadding};
  padding-horizontal: ${contentPadding};
`;

export const HeaderButtonIcon = styled(Icon)`
  font-size: ${headerFontSize};
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
    initialListSize?: number,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    refreshFn?: Function,
    refreshText?: string,
    renderRow: Function,
    renderSectionHeader?: Function,
    style?: ?Object,
    readIds: Array<string>,
    sectionHeaderHasChanged?: Function,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
    title: string,
    width?: number,
  };

  render() {
    const {
      initialListSize,
      items,
      loading,
      refreshFn,
      refreshText,
      renderRow,
      renderSectionHeader,
      sectionHeaderHasChanged,
      theme,
      ...props
    } = this.props;

    const _radius = getRadius(props);

    return (
      <ColumnWithHeader {...this.props}>
        <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={_radius}>
          <StyledImmutableListView
            immutableData={items}
            initialListSize={initialListSize || 5}
            rowsDuringInteraction={initialListSize || 5}
            renderRow={renderRow}
            renderSectionHeader={renderSectionHeader}
            refreshControl={
              refreshFn &&
              <RefreshControl
                refreshing={false}
                onRefresh={refreshFn}
                colors={[loading ? 'transparent' : theme.base07]}
                tintColor={loading ? 'transparent' : theme.base07}
                title={(refreshText || ' ').toLowerCase()}
                titleColor={theme.base05}
                progressBackgroundColor={theme.base02}
              />
            }
            sectionHeaderHasChanged={sectionHeaderHasChanged}
            contentContainerStyle={{ overflow: 'hidden' }}
            removeClippedSubviews
          />
        </StyledTextOverlay>
      </ColumnWithHeader>
    );
  }
}
