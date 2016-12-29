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
import { getNotificationIcon, getOrgAvatar, getOwnerAndRepo } from '../../utils/helpers/github';
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

    const comment = fromJS(notification.get('comment'));
    const repo = notification.get('repository');
    const subject = notification.get('subject');
    const updatedAt = notification.get('updated_at');

    if (!subject) return null;

    const avatarUrl = getOrgAvatar(repo.getIn(['owner', 'login']));
    const notificationIds = Set([notification.get('id')]);
    const reason = notification.get('reason');
    const { repo: repoName } = getOwnerAndRepo(repo.get('full_name') || repo.get('name'));
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

        <FullAbsoluteView
          style={{
            top: contentPadding + avatarWidth,
            left: contentPadding,
            right: null,
            width: avatarWidth,
            zIndex: 1,
          }}
        >
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
                  <Text numberOfLines={1}>
                    <Username numberOfLines={1}>
                      {repoName}
                    </Username>
                    <IntervalRefresh
                      interval={1000}
                      onRender={
                        () => {
                          const dateText = getDateSmallText(updatedAt, '•');
                          return dateText && (
                            <SmallText muted>
                             &nbsp;•&nbsp;{dateText}
                            </SmallText>
                          );
                        }
                      }
                    />
                  </Text>
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
