/**
 * This hook is for notarizing a Mac app using electron-notarize as an after-sign hook in electron-builder.
 */
const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');

module.exports = async function (params) {
  // Only notarize the app on Mac OS
  if (process.platform !== 'darwin') {
    return;
  }

  // Only notarize if we are packaging for mac, not windows
  let appId = 'com.bullhorn.dataloader';
  let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    return;
  }

  console.log(` * notarizing       ${appPath}`);
  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
    });
  } catch (error) {
    console.error(error);
  }
};
