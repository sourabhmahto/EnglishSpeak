const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin to fix the AndroidX / legacy Support Library manifest merger conflict.
 *
 * @react-native-voice/voice pulls in com.android.support:support-compat:28.0.0
 * which conflicts with androidx.core:core used by React Native 0.76+.
 *
 * The fix is to:
 *  1. Add the `xmlns:tools` namespace to the <manifest> root element.
 *  2. Add `tools:replace="android:appComponentFactory"` to the <application> element
 *     so the Gradle manifest merger lets the AndroidX value win.
 */
module.exports = function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    // 1. Ensure tools namespace is declared on the root <manifest> element
    if (!manifest.manifest.$) {
      manifest.manifest.$ = {};
    }
    manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // 2. Add tools:replace on the <application> element
    const application = manifest.manifest.application[0];
    if (!application.$) {
      application.$ = {};
    }
    application.$['tools:replace'] = 'android:appComponentFactory';

    return config;
  });
};
