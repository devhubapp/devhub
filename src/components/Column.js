// @flow

import ActionSheet from 'react-native-actionsheet';
import React from 'react';
import { Dimensions, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';

import { iconRightMargin } from './Card';
import Card from './Card';
import CreateColumnUtils from './utils/CreateColumnUtils';
import ProgressBar from './ProgressBar';
import ScrollableContentContainer from './ScrollableContentContainer';
import Themable from './hoc/Themable';
import TransparentTextOverlay from './TransparentTextOverlay';
// import { columnMargin } from './Columns';
import { getIcon } from '../api/github';
import { getDateWithHourAndMinuteText } from '../utils/helpers';
import { contentPadding } from '../styles/variables';
import type { ActionCreators, Column, GithubEvent, Subscription, ThemeObject } from '../utils/types';

const getFullWidth = () => Dimensions.get('window').width;
const getWidth = () => getFullWidth() - (2 * contentPadding) - (4 * 2); // columnMargin

const Root = styled.View`
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const StyledTextOverlay = styled(TransparentTextOverlay) `
  border-radius: ${({ radius }) => radius || 0};
`;

const HeaderButtonsContainer = styled.View`
  flex-direction: row;
  padding-right: ${iconRightMargin};
`;

const Title = styled.Text`
  padding: ${contentPadding};
  font-size: 20;
  color: ${({ theme }) => theme.base04};
`;

const HeaderButton = styled.TouchableOpacity`
  padding-vertical: ${contentPadding};
  padding-horizontal: ${contentPadding};
`;

const HeaderButtonText = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.base04};
`;

const FixedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: ${20 + (3 * contentPadding)};
`;

const ProgressBarContainer = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.base01};
`;

// const HiddenHeader = styled.View`
//   align-items: flex-start;
//   min-height: 30;
//   margin-top: -25;
//   align-items: center;
//   justify-content: center;
//   overflow: visible;
// `;

// const SubHeaderText = styled.Text`
//   text-align: center;
//   font-size: 12;
//   color: ${({ theme }) => theme.base05};
// `;

// renderHeader={
//   () => (
//     <HiddenHeader>
//       <SubHeaderText>{updatedText.toLowerCase()}</SubHeaderText>
//     </HiddenHeader>
//   )
// }

const buttons = ['Create new column', 'Mark all as seen / unseen', 'Clear seen', 'Delete column', 'Cancel'];
const BUTTONS = {
  CREATE_NEW_COLUMN: 0,
  MARK_EVENTS_AS_SEEN_OR_UNSEEN: 1,
  CLEAR_SEEN: 2,
  DELETE_COLUMN: 3,
  CANCEL: 4,
};

@Themable
export default class extends React.PureComponent {
  state = {
    loadingWithDelay: false,
    loadingWithDelayStartedAt: null,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.loading && !this.state.loadingWithDelay) {
      this.setState({ loadingWithDelay: true, loadingWithDelayStartedAt: new Date() });
    } else if (!newProps.loading && this.state.loadingWithDelay) {
      const timeLoading = Math.max(0, new Date() - this.state.loadingWithDelayStartedAt);
      const minimalTimeShowingLoadingIndicator = 1000;
      const delayToAchiveMinimalTime = timeLoading > minimalTimeShowingLoadingIndicator
        ? 0
        : minimalTimeShowingLoadingIndicator - timeLoading
        ;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ loadingWithDelay: false, loadingWithDelayStartedAt: null });
        clearTimeout(this.timeout);
      }, delayToAchiveMinimalTime);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onRefresh = () => {
    this.setState({ loadingWithDelay: true });

    const { column, actions: { updateColumnSubscriptions } } = this.props;
    updateColumnSubscriptions(column.get('id'));
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetButtonPress = (index) => {
    const { actions, column, events } = this.props;

    const columnId = column.get('id');
    const eventIds = events.map(event => event.get('id'));

    switch (index) {
      case BUTTONS.CREATE_NEW_COLUMN:
        CreateColumnUtils.showColumnTypeSelectAlert(actions);
        break;

      case BUTTONS.MARK_EVENTS_AS_SEEN_OR_UNSEEN:
        if (column.get('allSeen')) {
          actions.markEventsAsUnseen({ columnId, eventIds });
        } else {
          actions.markEventsAsSeen({ columnId, eventIds });
        }

        break;

      case BUTTONS.CLEAR_SEEN:
        const seenEventIds = events.filter(e => e.get('seen')).map(e => e.get('id'));
        actions.hideEvents({ columnId, eventIds: seenEventIds });
        break;

      case BUTTONS.DELETE_COLUMN:
        actions.deleteColumn(columnId);
        break;

      default:
        break;
    }
  };

  timeout = null;

  props: {
    actions: ActionCreators,
    column: Column,
    events: Array<GithubEvent>,
    radius?: number,
    style?: ?Object,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
  };

  renderRow = (event) => (
    <Card
      key={`card-${event.get('id')}`}
      actions={this.props.actions}
      event={event}
    />
  );

  render() {
    const { events, radius, subscriptions, theme, ...props } = this.props;

    const { title, updatedAt } = {
      title: (this.props.column.get('title') || '').toLowerCase(),
      updatedAt: this.props.column.get('updatedAt'),
    };

    const icon = (
      subscriptions && subscriptions.size > 0
        ? getIcon(subscriptions.first().get('requestType'))
        : ''
    ) || 'mark-github';

    const dateFromNowText = getDateWithHourAndMinuteText(updatedAt);
    const updatedText = dateFromNowText ? `Updated ${dateFromNowText}` : '';

    return (
      <Root radius={radius} {...props}>
        <FixedHeader>
          <TransparentTextOverlay color={theme.base02} size={contentPadding} from="right">
            <ScrollableContentContainer>
              <Title numberOfLines={1}>
                <Icon name={icon} size={20} />&nbsp;{title}
              </Title>
            </ScrollableContentContainer>
          </TransparentTextOverlay>

          <HeaderButtonsContainer>
            <HeaderButton onPress={this.showActionSheet}>
              <HeaderButtonText><Icon name="settings" size={20} /></HeaderButtonText>
            </HeaderButton>
          </HeaderButtonsContainer>
        </FixedHeader>

        <ProgressBarContainer>
          {
            this.state.loadingWithDelay &&
            <ProgressBar
              width={getWidth()}
              height={1}
              indeterminate
            />
          }
        </ProgressBarContainer>

        <StyledTextOverlay color={theme.base02} size={contentPadding} from="bottom" radius={radius}>
          <ImmutableListView
            immutableData={events}
            initialListSize={5}
            rowsDuringInteraction={5}
            renderRow={this.renderRow}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
                colors={[this.state.loadingWithDelay ? 'transparent' : theme.base08]}
                tintColor={this.state.loadingWithDelay ? 'transparent' : theme.base08}
                title={(updatedText || ' ').toLowerCase()}
                titleColor={theme.base05}
                progressBackgroundColor={theme.base02}
              />
            }
          />
        </StyledTextOverlay>

        <ActionSheet
          ref={(ref) => { this.ActionSheet = ref; }}
          title={title}
          options={buttons}
          cancelButtonIndex={BUTTONS.CANCEL}
          destructiveButtonIndex={BUTTONS.DELETE_COLUMN}
          onPress={this.handleActionSheetButtonPress}
        />
      </Root>
    );
  }
}
