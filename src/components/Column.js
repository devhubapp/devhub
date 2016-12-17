// @flow

import uniq from 'lodash/uniq';
import ActionSheet from 'react-native-actionsheet';
import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { Dimensions, RefreshControl } from 'react-native';

import {
  makeColumnEventIdsSelector,
  makeColumnSeenEventIdsSelector,
} from '../selectors';

import CardContainer from '../containers/CardContainer';
import { iconRightMargin } from './Card';
import CreateColumnUtils from './utils/CreateColumnUtils';
import ProgressBar from './ProgressBar';
import RepositoryStarButtonContainer from '../containers/RepositoryStarButtonContainer';
import StatusMessage from './StatusMessage';
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

export const TitleWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Title = styled.Text`
  padding: ${contentPadding};
  padding-top: ${contentPadding + 4};
  line-height: 20;
  font-size: 20;
  font-weight: 600;
  color: ${({ theme }) => theme.base04};
  background-color: transparent;
`;

const StyledRepositoryStarButtonContainer = styled(RepositoryStarButtonContainer)`
  margin-left: ${contentPadding / 2};
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
  min-height: ${20 + (2 * contentPadding)};
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

@withTheme
export default class extends React.PureComponent {
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const uniqRepository = this.getUpdatedUniqRepository(props);
    this.state.uniqRepository = uniqRepository;
  }

  state = {
    loadingWithDelay: false,
    loadingWithDelayStartedAt: null,
    uniqRepository: null,
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

    if (newProps.subscriptions !== this.props.subscriptions) {
      const uniqRepository = this.getUpdatedUniqRepository(newProps);
      this.setState({ uniqRepository });
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

  getUpdatedUniqRepository(newProps) {
    const props = newProps || this.props;
    const { events, subscriptions } = props;

    const repos = subscriptions && subscriptions.toJS().map(subscription => {
      const { repo, owner } = subscription.params || {};
      if (!(owner && repo)) return null;
      return `${owner}/${repo}`;
    }).filter(Boolean);

    const onlyOneRepository = repos && uniq(repos).length === 1;
    const uniqRepository = (onlyOneRepository && events && events.getIn([0, 'repo'])) || null;

    return uniqRepository;
  }

  getEventIdsAndSeenEventIds = () => {
    const { column } = this.props;

    const columnId = column.get('id');

    const store = this.context.store;
    const state = store.getState();

    this.columnEventIdsSelector = this.columnEventIdsSelector || makeColumnEventIdsSelector();
    this.columnSeenEventIdsSelector = this.columnSeenEventIdsSelector || makeColumnSeenEventIdsSelector();

    return {
      eventIds: this.columnEventIdsSelector(state, { columnId }),
      seenEventIds: this.columnSeenEventIdsSelector(state, { columnId }),
    };
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetButtonPress = (index) => {
    const { actions, column } = this.props;

    const columnId = column.get('id');

    switch (index) {
      case BUTTONS.CREATE_NEW_COLUMN:
        CreateColumnUtils.showColumnTypeSelectAlert(actions);
        break;

      case BUTTONS.MARK_EVENTS_AS_SEEN_OR_UNSEEN:
        (() => {
          const { eventIds, seenEventIds } = this.getEventIdsAndSeenEventIds();

          if (seenEventIds && seenEventIds.size >= eventIds.size) {
            actions.markEventsAsUnseen({ columnId, eventIds });
          } else {
            actions.markEventsAsSeen({ columnId, eventIds });
          }
        })();

        break;

      case BUTTONS.CLEAR_SEEN:
        (() => {
          const { seenEventIds } = this.getEventIdsAndSeenEventIds();
          actions.clearEvents({ columnId, eventIds: seenEventIds });
        })();
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
    errors?: ?Array<string>,
    events: Array<GithubEvent>,
    radius?: number,
    style?: ?Object,
    seenEventIds: Array<string>,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
  };

  renderRow = (event) => (
    <CardContainer
      key={`card-${event.get('id')}`}
      actions={this.props.actions}
      eventOrEventId={event && event.get('merged') ? event : event.get('id')}
      onlyOneRepository={!!this.state.uniqRepository}
    />
  );
  
  render() {
    const { loadingWithDelay, uniqRepository } = this.state;
    const { column, errors, events, radius, subscriptions, theme, ...props } = this.props;

    if (!column) return null;

    const title = (column.get('title') || '').toLowerCase();

    const updatedAt = subscriptions && subscriptions.size > 0
      ? subscriptions.first().get('updatedAt')
      : null;

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
          <TitleWrapper>
            <Title numberOfLines={1} style={{ maxWidth: 280 }}>
              <Icon name={icon} size={20} />&nbsp;{title}
            </Title>

            {
              uniqRepository && (
                <StyledRepositoryStarButtonContainer
                  repoId={uniqRepository.get('id')}
                  containerStyle={{ marginTop: 4, marginLeft: -contentPadding }}
                />
              )
            }
          </TitleWrapper>

          <HeaderButtonsContainer>
            <HeaderButton onPress={this.showActionSheet}>
              <HeaderButtonText><Icon name="settings" size={20} /></HeaderButtonText>
            </HeaderButton>
          </HeaderButtonsContainer>
        </FixedHeader>

        <ProgressBarContainer>
          {
            loadingWithDelay &&
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
          <ImmutableListView
            immutableData={events}
            initialListSize={5}
            rowsDuringInteraction={5}
            renderRow={this.renderRow}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
                colors={[loadingWithDelay ? 'transparent' : theme.base08]}
                tintColor={loadingWithDelay ? 'transparent' : theme.base08}
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
