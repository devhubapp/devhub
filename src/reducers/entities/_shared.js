import { isArchivedFilter } from '../../selectors';

function _markIdsAsFn(state, ids, fn, date, ...fnArgs) {
  const _date = date || new Date();

  let newState = state;
  ids.forEach((id) => {
    const obj = newState.get(id);
    if (!obj) return;

    const newObj = fn(obj, _date, ...fnArgs);
    newState = newState.set(id, newObj);
  });

  return newState;
}

export const markAsArchived = (obj, archivedAt) => (
  // prevent remarking as archived
  isArchivedFilter(obj)
    ? obj
    : obj.set('archived_at', archivedAt || new Date())
);

export function markIdsAsArchived(state, ids, archivedAt, ...args) {
  return _markIdsAsFn(state, ids, markAsArchived, archivedAt, ...args);
}

// unread:true: not read on github
// unread:false: read on github (we dont need to call api anymore for this)
// unread:null: read on app, unknown on github
export const markAsRead = (notification, lastReadAt, finalUnreadStatus = true) => (
  notification
    .set('unread', notification.get('unread') === false || finalUnreadStatus ? false : null)
    .set('last_read_at', lastReadAt || new Date())

  // we mark the last_unread_at as null
  // because when the notification is updated,
  // the last_read_at from github would replace the last_read_at from the app,
  // and would make the notification be always marked as unread
  // because the last_read_at from github is always before last_unread_at from the app
  // (unread = last_unread_at && last_unread_at > last_read_at).
    .set('last_unread_at', null)
);

export function markIdsAsRead(state, ids, lastReadAt, finalUnreadStatus, ...args) {
  return _markIdsAsFn(state, ids, markAsRead, lastReadAt, finalUnreadStatus, ...args);
}

export const undoMarkAsRead = (notification) => (
  notification
    .set('unread', true)
    .set('last_read_at', null)
);

export function undoMarkIdsAsRead(state, ids, ...args) {
  return _markIdsAsFn(state, ids, undoMarkAsRead, ...args);
}

export const markAsUnread = (notification, lastUnreadAt) => (
  notification
    // .set('unread', true) // dont!
    .set('last_unread_at', lastUnreadAt || new Date())
);

export function markIdsAsUnread(state, ids, lastUnreadAt, ...args) {
  return _markIdsAsFn(state, ids, markAsUnread, lastUnreadAt, ...args);
}

