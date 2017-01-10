// @flow

import React from 'react';
import { Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EventCard from '../components/cards/EventCard';

import {
  makeIsArchivedEventSelector,
  makeDenormalizedEventSelector,
  makeIsReadEventSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  GithubEvent,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const denormalizedEventSelector = makeDenormalizedEventSelector();
  const isArchivedEventSelector = makeIsArchivedEventSelector();
  const isReadEventSelector = makeIsReadEventSelector();

  return (state: State, { eventOrEventId }: { eventOrEventId: string|GithubEvent }) => {
    const event = Iterable.isIterable(eventOrEventId) ? eventOrEventId : null;
    const eventId = event ? `${event.get('id')}` : eventOrEventId;

    return {
      archived: isArchivedEventSelector(state, { eventId }),
      event: event || denormalizedEventSelector(state, { eventId }),
      read: isReadEventSelector(state, { eventId }),
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
    read: boolean,
  };

  render() {
    const { actions, event, read, ...props } = this.props;

    return (
      <EventCard
        actions={actions}
        event={event}
        read={read}
        {...props}
      />
    );
  }
}
