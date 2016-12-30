// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { fromJS, Map, Set } from 'immutable';

// rows
import CommentRow from './_CommentRow';
import CommitRow from './_CommitRow';
import IssueRow from './_IssueRow';
import PullRequestRow from './_PullRequestRow';
import RepositoryRow from './_RepositoryRow';

import IntervalRefresh from '../IntervalRefresh';
import OwnerAvatar from './_OwnerAvatar';
import Label from '../Label';
import { contentPadding } from '../../styles/variables';
import { getDateSmallText, trimNewLinesAndSpaces } from '../../utils/helpers';
import { getNotificationIconAndColor, getNotificationReasonTextsAndColor, getOrgAvatar } from '../../utils/helpers/github';
import type { ActionCreators, GithubNotification } from '../../utils/types';

import {
  smallAvatarWidth,
  CardWrapper,
  FullView,
  FullAbsoluteView,
  Header,
  LeftColumn,
  MainColumn,
  HeaderRow,
  SmallText,
  CardIcon,
} from './__CardComponents';

export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    onlyOneRepository?: ?boolean,
    notification: GithubNotification,
  };

  render() {
    const { actions, onlyOneRepository, notification, ...props } = this.props;

    const comment = fromJS(notification.get('comment'));
    const repo = notification.get('repository');
    const subject = notification.get('subject');
    const updatedAt = notification.get('updated_at');

    if (!subject) return null;

    const avatarUrl = getOrgAvatar(repo.getIn(['owner', 'login']));
    const notificationIds = Set([notification.get('id')]);
    const seen = notification.get('unread') === false;
    const title = trimNewLinesAndSpaces(subject.get('title'));
    const { label, color } = getNotificationReasonTextsAndColor(notification);

    const subjectType = (subject.get('type') || '').toLowerCase();
    const commit = (subjectType === 'commit' && subject) || null;
    const issue = (subjectType === 'issue' && subject) || null;
    const pullRequest = (subjectType === 'pullrequest' && subject) || null;

    const { icon: cardIcon, color: cardIconColor } = getNotificationIconAndColor(notification);

    return (
      <CardWrapper {...props} seen={seen}>
        <FullAbsoluteView zIndex={seen ? 1 : -1}>
          <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <FullAbsoluteView
          style={{
            top: contentPadding + smallAvatarWidth,
            left: contentPadding,
            right: null,
            width: smallAvatarWidth,
            zIndex: 1,
          }}
        >
          <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <Header>
          <LeftColumn center>
            {
              avatarUrl &&
              <OwnerAvatar url={avatarUrl} size={smallAvatarWidth} />
            }
          </LeftColumn>

          <MainColumn>
            <HeaderRow>
              <FullView center horizontal>
                <Label numberOfLines={1} color={color} outline>{label}</Label>

                <IntervalRefresh
                  interval={1000}
                  onRender={
                    () => {
                      const dateText = getDateSmallText(updatedAt, '•');
                      return dateText && (
                        <SmallText numberOfLines={1} muted>&nbsp;&nbsp;{dateText}</SmallText>
                      );
                    }
                  }
                />
              </FullView>

              <CardIcon name={cardIcon} color={cardIconColor} />
            </HeaderRow>

            <FullAbsoluteView>
              <TouchableWithoutFeedback onPress={() => actions.toggleSeenNotification(notificationIds)}>
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {
          repo && !onlyOneRepository &&
          <RepositoryRow actions={actions} repo={repo} narrow />
        }

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
