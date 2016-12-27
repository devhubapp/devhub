// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { fromJS, Map, Set } from 'immutable';

// rows
import CommentRow from './_CommentRow';
import CommitRow from './_CommitRow';
import IssueRow from './_IssueRow';
import PullRequestRow from './_PullRequestRow';

import IntervalRefresh from '../IntervalRefresh';
import UserAvatar from './_UserAvatar';
import { avatarWidth, contentPadding } from '../../styles/variables';
import { getDateSmallText, trimNewLinesAndSpaces } from '../../utils/helpers';
import { getNotificationIcon, getOrgAvatar } from '../../utils/helpers/github';
import type { ActionCreators, GithubNotification } from '../../utils/types';

import {
  CardWrapper,
  FullView,
  FullAbsoluteView,
  HorizontalView,
  Header,
  LeftColumn,
  MainColumn,
  HeaderRow,
  Text,
  SmallText,
  Username,
  CardIcon,
} from './__CardComponents';

export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    notification: GithubNotification,
  };

  render() {
    const { actions, notification, ...props } = this.props;

    console.log('comment', notification.get('comment'));

    const {
      comment,
      repo,
      subject,
      updated_at,
    } = {
      comment: fromJS(notification.get('comment')),
      repo: notification.get('repository'),
      subject: notification.get('subject'),
      updated_at: notification.get('updated_at'),
    };

    if (!subject) return null;

    const avatarUrl = getOrgAvatar(repo.getIn(['owner', 'login']));
    const notificationIds = Set([notification.get('id')]);
    const reason = notification.get('reason');
    const seen = notification.get('unread') === false;
    const title = trimNewLinesAndSpaces(subject.get('title'));

    const commit = subject.get('type') !== 'Commit' ? null : notification.get('commit') || Map({
      message: trimNewLinesAndSpaces(subject.get('title')),
    });

    const issue = subject.get('type') !== 'Issue' ? null : notification.get('issue') || Map({
      number: subject.get('issueNumber'),
      title,
    });

    const pullRequest = subject.get('type') !== 'PullRequest' ? null : notification.get('pull_request') || Map({
      number: subject.get('pullRequestNumber'),
      title,
    });

    return (
      <CardWrapper {...props} seen={seen}>
        <FullAbsoluteView zIndex={seen ? 1 : -1}>
          <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <FullAbsoluteView style={{ top: contentPadding + avatarWidth, left: contentPadding, right: null, width: avatarWidth, zIndex: 1 }}>
          <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <Header>
          <LeftColumn>
            <UserAvatar url={avatarUrl} size={avatarWidth} />
          </LeftColumn>

          <MainColumn>
            <HeaderRow>
              <FullView>
                <HorizontalView>
                  <Username numberOfLines={1}>
                    {repo.get('name')}
                  </Username>
                  <IntervalRefresh
                    interval={1000}
                    onRender={
                      () => {
                        const dateText = getDateSmallText(updated_at, '•');
                        return dateText && (
                          <SmallText style={{ flex: 1 }} numberOfLines={1} muted> • {dateText}</SmallText>
                        );
                      }
                    }
                  />
                </HorizontalView>

                <Text numberOfLines={1}>{reason}</Text>
              </FullView>
              
              <CardIcon name={getNotificationIcon(notification)} />
            </HeaderRow>

            <FullAbsoluteView>
              <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {
          commit &&
          <CommitRow commit={commit} narrow />
        }

        {
          issue &&
          <IssueRow issue={issue} narrow />
        }

        {
          pullRequest &&
          <PullRequestRow pullRequest={pullRequest} narrow />
        }

        {
          !(commit || issue || pullRequest) && title &&
          <CommentRow body={title} narrow />
        }

        {
          comment && comment.get('body') &&
          <CommentRow user={comment.get('user')} body={comment.get('body')} narrow />
        }
      </CardWrapper>
    );
  }
}
