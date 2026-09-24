const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin to fix dependency conflicts in app/build.gradle.
 *
 * Forces exclusion of the legacy com.android.support:* libraries from
 * @react-native-voice/voice dependencies so they don't conflict with AndroidX.
 * Also ensures compileSdkVersion and targetSdkVersion are set correctly.
 */
module.exports = function withBuildGradleFix(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Force exclude legacy support library from @react-native-voice/voice
    const voiceExclude = `
    // Fix: Exclude legacy Android Support Library from @react-native-voice/voice
    // to prevent manifest merger conflict with AndroidX
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.13.1'
        }
        exclude group: 'com.android.support', module: 'support-compat'
        exclude group: 'com.android.support', module: 'support-annotations'
        exclude group: 'com.android.support', module: 'support-v4'
    }
`;

    // Insert the configuration block before the dependencies block
    if (!buildGradle.includes('configurations.all') && buildGradle.includes('dependencies {')) {
      buildGradle = buildGradle.replace(
        'dependencies {',
        voiceExclude + '\ndependencies {'
      );
    }

    config.modResults.contents = buildGradle;
    return config;
  });
};
