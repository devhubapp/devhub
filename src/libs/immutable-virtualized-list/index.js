/* eslint-disable react/no-multi-comp */

import Immutable from 'immutable';
import React, { PureComponent } from 'react';

import SectionList
  from 'react-native/Libraries/CustomComponents/Lists/SectionList';

import VirtualizedList
  from 'react-native/Libraries/CustomComponents/Lists/VirtualizedList';

import { get } from '../../utils/immutable';

const propTypes = {
  immutableData: (props, propName, componentName) => {
    // if (Immutable.Map.isMap(props[propName])) {
    //   return new Error(
    //     `Invalid prop ${propName} supplied to ${componentName}:
    // Support for Immutable.Map is coming soon. For now, try an Immutable List, Set, or Range.`,
    //   );
    // } else
    if (!Immutable.Iterable.isIterable(props[propName])) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}: Must be instance of Immutable.Iterable.`,
      );
    }

    return null;
  },
};

const isMapOrSet = item => (
  Immutable.Map.isMap(item) ||
    Immutable.OrderedMap.isOrderedMap(item) ||
    Immutable.Set.isSet(item) ||
    Immutable.OrderedSet.isOrderedSet(item)
);

const getItem = (items, index) => get(items, index);
const getItemCount = items => items.size;
const keyExtractor = (item, index) => (
  isMapOrSet(item) && (get(item, 'key') || get(item, 'id'))
    ? (get(item, 'key') || get(item, 'id'))
    : typeof item === 'string' || typeof item === 'number'
        ? String(item)
        : String(index)
);

export default class ImmutableVirtualizedList extends PureComponent {
  static propTypes = { ...VirtualizedList.propTypes, ...propTypes };

  render() {
    const { immutableData, ...props } = this.props;

    return (
      <VirtualizedList
        data={immutableData}
        getItem={props.getItem || getItem}
        getItemCount={props.getItemCount || getItemCount}
        keyExtractor={props.keyExtractor || keyExtractor}
        {...props}
      />
    );
  }
}

export class ImmutableSectionList extends PureComponent {
  static propTypes = { ...SectionList.propTypes, ...propTypes };

  render() {
    const { immutableData, sections, ...props } = this.props;

    const _sections = sections && typeof sections.toJS === 'function' ? sections.toJS() : sections;

    return (
      <SectionList
        data={immutableData}
        getItem={props.getItem || getItem}
        getItemCount={props.getItemCount || getItemCount}
        keyExtractor={props.keyExtractor || keyExtractor}
        sections={_sections}
        {...props}
      />
    );
  }
}
