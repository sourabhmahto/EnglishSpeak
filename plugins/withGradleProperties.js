const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Config plugin to force AndroidX mode and enable Jetifier in gradle.properties.
 *
 * - android.useAndroidX=true   : tells Gradle to use AndroidX libraries
 * - android.enableJetifier=true: automatically migrates third-party legacy
 *   Support Library dependencies (like those from @react-native-voice/voice)
 *   to their AndroidX equivalents at build time.
 */
module.exports = function withAndroidXFix(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    const setOrReplace = (key, value) => {
      const existing = props.find(
        (p) => p.type === 'property' && p.key === key
      );
      if (existing) {
        existing.value = value;
      } else {
        props.push({ type: 'property', key, value });
      }
    };

    setOrReplace('android.useAndroidX', 'true');
    setOrReplace('android.enableJetifier', 'true');

    return config;
  });
};
