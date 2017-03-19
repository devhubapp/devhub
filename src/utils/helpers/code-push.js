import codePush from 'react-native-code-push';

import pkg from '../../../package.json';

export const appVersionText = `v${pkg.codeBundleId || pkg.version}`;

export const getStatusText = status => {
  switch (status) {
    case codePush.SyncStatus.AWAITING_USER_ACTION: return 'Update available.';
    case codePush.SyncStatus.SYNC_IN_PROGRESS:
    case codePush.SyncStatus.CHECKING_FOR_UPDATE: return 'Checking for update...';
    case codePush.SyncStatus.DOWNLOADING_PACKAGE: return 'Downloading update...';
    case codePush.SyncStatus.INSTALLING_UPDATE: return 'Installing update...';
    case codePush.SyncStatus.UNKNOWN_ERROR: return 'Unknown error.';
    case codePush.SyncStatus.UP_TO_DATE: return 'App is up to date.';
    case codePush.SyncStatus.UPDATE_IGNORED: return 'Update ignored';
    default: return appVersionText;
  }
};

export const isCodePushRunningSomeTask = status => {
  switch (status) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
    case codePush.SyncStatus.INSTALLING_UPDATE:
    case codePush.SyncStatus.SYNC_IN_PROGRESS:
      return true;

    default:
      return false;
  }
};
