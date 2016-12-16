// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Card from '../components/Card';

import {
  makeDenormalizedEventSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  GithubEvent,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const denormalizedEventSelector = makeDenormalizedEventSelector();

  return (state: State, { eventId }: { eventId: string }) => ({
    event: denormalizedEventSelector(state, { eventId }),
  });
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    event: GithubEvent,
  };

  render() {
    const { actions, event, ...props } = this.props;

    return (
      <Card
        actions={actions}
        event={event}
        {...props}
      />
    );
  }
}
