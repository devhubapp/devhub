
import moment from 'moment';
import { Map } from 'immutable';

import { isArchivedFilter, isDeletedFilter } from '../../selectors';

export function updateByIdsUsingFn(state, ids, fn, ...fnArgs) {
  let newState = state;
  ids.forEach(id => {
    const item = newState.get(id);
    if (!item) return;

    const newObj = fn(item, ...fnArgs);

    newState = newObj === null
      ? newState.delete(id)
      : newState.set(id, newObj);
  });

  return newState;
}

export const markAsDeleted = (item, deletedAt) => (
  // prevent remarking as deleted
  isDeletedFilter(item)
    ? item
    : Map({ deleted_at: deletedAt || moment().toISOString() })
);

export const deleteByIds = (state, ids, deletedAt, softDelete = false) => {
  const fn = softDelete ? markAsDeleted : () => null;
  return updateByIdsUsingFn(state, ids, fn);
};

export const markAsArchived = (item, archivedAt) => (
  // prevent remarking as archived
  isArchivedFilter(item)
    ? item
    : item.set('archived_at', archivedAt || moment().toISOString())
);

export const markAsArchivedByIds = (state, ids, archivedAt, ...args) =>
  updateByIdsUsingFn(
    state,
    ids,
    markAsArchived,
    archivedAt || moment().toISOString(),
    ...args,
  );

// unread:true: not read on github
// unread:false: read on github (we dont need to call api anymore for this)
// unread:null: read on app, unknown on github
export const markAsRead = (item, lastReadAt, finalUnreadStatus = true) =>
  item
    .set(
      'unread',
      item.get('unread') === false || finalUnreadStatus ? false : null,
    )
    .set('last_read_at', lastReadAt || moment().toISOString())
    // we mark the last_unread_at as null
    // because when the notification is updated,
    // the last_read_at from github would replace the last_read_at from the app,
    // and would make the notification be always marked as unread
    // because the last_read_at from github is always before last_unread_at from the app
    // (unread = last_unread_at && last_unread_at > last_read_at).
    .set('last_unread_at', null);

export const markAsReadByIds = (
  state,
  ids,
  lastReadAt,
  finalUnreadStatus,
  ...args
) =>
  updateByIdsUsingFn(
    state,
    ids,
    markAsRead,
    lastReadAt || moment().toISOString(),
    finalUnreadStatus,
    ...args,
  );

export const undoMarkAsRead = notification =>
  notification.set('unread', true).set('last_read_at', null);

export const undoMarkAsReadByIds = (state, ids, ...args) =>
  updateByIdsUsingFn(state, ids, undoMarkAsRead, ...args);

export const markAsUnread = (notification, lastUnreadAt) => notification
  // .set('unread', true) // dont!
  .set('last_unread_at', lastUnreadAt || moment().toISOString());

export const markAsUnreadByIds = (state, ids, lastUnreadAt, ...args) =>
  updateByIdsUsingFn(
    state,
    ids,
    markAsUnread,
    lastUnreadAt || moment().toISOString(),
    ...args,
  );
