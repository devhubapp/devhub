import { isArchivedFilter } from '../../selectors';

function _markIdsAsFn(state, ids, date, fn) {
  const _date = date || new Date();

  let newState = state;
  ids.forEach((id) => {
    const obj = newState.get(id);
    if (!obj) return;

    const newObj = fn(obj, _date);
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

export function markIdsAsArchived(state, ids, archivedAt) {
  return _markIdsAsFn(state, ids, archivedAt, markAsArchived);
}

export const markAsRead = (notification, lastReadAt) => (
  notification
    .set('last_read_at', lastReadAt || new Date())

  // not used for the events, only notifications.
  // we mark the last_unread_at as null
  // because when the notification is updated,
  // the last_read_at from github would replace the last_read_at from the app,
  // and would make the notification be always marked as unread
  // because the last_read_at from github is always before last_unread_at from the app
  // (unread = last_unread_at && last_unread_at > last_read_at).
    .set('last_unread_at', null)
);

export function markIdsAsRead(state, ids, lastReadAt) {
  return _markIdsAsFn(state, ids, lastReadAt, markAsRead);
}

export const undoMarkAsRead = (notification) => (
  notification
    .set('last_read_at', null)
);

export function undoMarkIdsAsRead(state, ids) {
  return _markIdsAsFn(state, ids, undefined, undoMarkAsRead);
}

export const markAsUnread = (notification, lastUnreadAt) => (
  notification
    // we dont set unread=true because we use this field to track the read status on github website
    // and github does not support setting as unread.
    // doing this, we can prevent calling markAsRead api method unnecessarily.
    // .set('unread', true)

    .set('last_unread_at', lastUnreadAt || new Date())
);

export function markIdsAsUnread(state, ids, lastUnreadAt) {
  return _markIdsAsFn(state, ids, lastUnreadAt, markAsUnread);
}

