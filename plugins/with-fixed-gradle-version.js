const { withProjectBuildGradle } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFixedGradleVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    const gradleWrapperPath = path.join(
      config.modRequest.projectRoot,
      'android/gradle/wrapper/gradle-wrapper.properties'
    );
    if (fs.existsSync(gradleWrapperPath)) {
      let content = fs.readFileSync(gradleWrapperPath, 'utf8');
      content = content.replace(
        /distributionUrl=.*(\r?\n)/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.6-bin.zip$1'
      );
      fs.writeFileSync(gradleWrapperPath, content);
      console.log('✅ Forced Gradle version 8.6 applied');
    }
    return config;
  });
};
