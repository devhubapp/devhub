/* eslint-disable import/prefer-default-export */

import pkg from '../../../package.json';

export const appVersionText = `v${pkg.codeBundleId || pkg.version}`;
