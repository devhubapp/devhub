/**
 * Source: https://github.com/electron-userland/electron-builder/issues/3870#issuecomment-498786448
 * Source: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
 */

require('dotenv').config()

const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  if (!(process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD)) {
    console.warn(
      'Skipping macOS app notarization.' +
        ' Missing one or more environment vars (APPLE_ID, APPLE_ID_PASSWORD).',
    )
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId: 'com.devhubapp',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  })
}
