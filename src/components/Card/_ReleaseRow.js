// @flow

import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import BranchRow from './_BranchRow';
import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';

import {
  CardText,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  Text,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import { trimNewLinesAndSpaces } from '../../utils/helpers';
import type { GithubEventType, ReleaseEvent, ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    narrow: boolean,
    release: ReleaseEvent,
    theme?: ThemeObject,
    type: GithubEventType,
  };

  render() {
    const { narrow, release, theme, type, ...props } = this.props;

    if (type !== 'ReleaseEvent' || !release) return null;

    const {
      body,
      branch,
      name,
      tagName,
    } = {
      body: trimNewLinesAndSpaces(release.get('body')),
      branch: release.get('target_commitish'),
      name: trimNewLinesAndSpaces(release.get('name')),
      tagName: trimNewLinesAndSpaces(release.get('tag_name')),
    };

    return (
      <View>
        {
          branch &&
          <BranchRow branch={branch} type={type} narrow />
        }

        <ContentRow narrow={narrow} {...props}>
          <LeftColumn />

          <MainColumn>
            <HighlightContainerRow1>
              <FullView>
                <TransparentTextOverlay
                  color={theme.base01}
                  size={contentPadding}
                  from="horizontal"
                  radius={radius}
                >
                  <RepositoryContentContainer>
                    <Text numberOfLines={1}>
                      <Icon name="tag" />&nbsp;
                      {name || tagName}
                    </Text>
                  </RepositoryContentContainer>
                </TransparentTextOverlay>
              </FullView>
            </HighlightContainerRow1>
          </MainColumn>
        </ContentRow>

        {
          body &&
          <ContentRow narrow={narrow} {...props}>
            <LeftColumn />

            <MainColumn>
              <HighlightContainerRow1>
                <TransparentTextOverlay
                  color={theme.base01}
                  size={contentPadding}
                  from="horizontal"
                  radius={radius}
                >
                  <RepositoryContentContainer>
                    <CardText numberOfLines={1}>
                      <Icon name="megaphone" />&nbsp;
                      {body}
                    </CardText>
                  </RepositoryContentContainer>
                </TransparentTextOverlay>
              </HighlightContainerRow1>
            </MainColumn>
          </ContentRow>
        }
      </View>
    );
  }
}
