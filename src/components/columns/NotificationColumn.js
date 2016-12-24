// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';

import NotificationCardContainer from '../../containers/NotificationCardContainer';
import ProgressBar from '../ProgressBar';
import StatusMessage from '../StatusMessage';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { columnMargin, getWidth, spacing } from '../columns/_Columns';
import { contentPadding } from '../../styles/variables';
import type { ActionCreators, GithubNotification, ThemeObject } from '../../utils/types';

const Root = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.base00};
`;

const StyledTextOverlay = styled(TransparentTextOverlay) `
  flex: 1;
  border-radius: ${({ radius }) => radius || 0};
`;

const ProgressBarContainer = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.base01};
`;

const Column = styled.View`
  flex: 1;
  margin-horizontal: ${spacing + columnMargin};
  margin-vertical: ${columnMargin * 2};
  background-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
`;

@withTheme
export default class extends React.PureComponent {
  onRefresh = () => {
    const { actions: { updateNotificationsRequest } } = this.props;
    updateNotificationsRequest();
  };

  props: {
    actions: ActionCreators,
    errors?: ?Array<string>,
    loading?: boolean,
    notifications: Array<GithubNotification>,
    radius?: number,
    style?: ?Object,
    seenNotificationIds: Array<string>,
    theme: ThemeObject,
  };

  renderRow = (notification) => (
    <NotificationCardContainer
      key={`notification-card-${notification.get('id')}`}
      actions={this.props.actions}
      notificationOrNotificationId={notification}
    />
  );

  render() {
    const { notifications, errors, loading, radius, theme, ...props } = this.props;

    if (!notifications) return null;
    // console.log('notifications', notifications.toJS());

    return (
      <Root radius={radius} {...props}>
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

        <Column>
          <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={radius}>
            <StyledImmutableListViewListView
              immutableData={notifications}
              initialListSize={10}
              rowsDuringInteraction={10}
              renderRow={this.renderRow}
            />
          </StyledTextOverlay>
        </Column>
      </Root>
    );
  }
}

// crashing dunno why
// refreshControl={
//   <RefreshControl
//     refreshing={false}
//     onRefresh={this.onRefresh}
//     colors={[loading ? 'transparent' : theme.base08]}
//     tintColor={loading ? 'transparent' : theme.base08}
//     titleColor={theme.base05}
//     title="xxx"
//     progressBackgroundColor={theme.base00}
//   />
// }
