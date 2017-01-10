import { isArchivedFilter } from '../../selectors';

export const markAsArchived = (obj, archivedAt) => (
  // prevent remarking as archived
  isArchivedFilter(obj)
    ? obj
    : obj.set('archived_at', archivedAt || new Date())
);

export function archiveIds(state, ids) {
  const archivedAt = new Date();

  let newState = state;
  ids.forEach((id) => {
    const obj = newState.get(id);
    if (!obj) return;

    const newObj = markAsArchived(obj, archivedAt);
    newState = newState.set(id, newObj);
  });

  return newState;
}
