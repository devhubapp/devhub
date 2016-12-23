// @flow

import React from 'react';
import { Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EventCard from '../components/Cards/EventCard';

import {
  makeDenormalizedEventSelector,
  makeSeenEventSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  GithubEvent,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const denormalizedEventSelector = makeDenormalizedEventSelector();
  const seenEventSelector = makeSeenEventSelector();

  return (state: State, { eventOrEventId }: { eventOrEventId: string|GithubEvent }) => {
    const event = Iterable.isIterable(eventOrEventId) ? eventOrEventId : null;
    const eventId = event ? `${event.get('id')}` : eventOrEventId;

    return {
      event: event || denormalizedEventSelector(state, { eventId }),
      seen: seenEventSelector(state, { eventId }),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    event: GithubEvent,
    seen: boolean,
  };

  render() {
    const { actions, event, seen, ...props } = this.props;

    return (
      <EventCard
        actions={actions}
        event={event}
        seen={seen}
        {...props}
      />
    );
  }
}
