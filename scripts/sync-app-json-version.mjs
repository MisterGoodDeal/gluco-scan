import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appJsonPath = join(root, 'app.json');
const packageJsonPath = join(root, 'package.json');
const pbxprojPath = join(root, 'ios/glucoscan.xcodeproj/project.pbxproj');
const buildGradlePath = join(root, 'android/app/build.gradle');

const packageVersion = JSON.parse(readFileSync(packageJsonPath, 'utf8')).version;
const pbxproj = readFileSync(pbxprojPath, 'utf8');
const buildGradle = readFileSync(buildGradlePath, 'utf8');

const iosBuildMatch = pbxproj.match(/CURRENT_PROJECT_VERSION = (\d+);/);
const androidCodeMatch = buildGradle.match(/versionCode (\d+)/);

if (!iosBuildMatch) {
  throw new Error('CURRENT_PROJECT_VERSION not found in project.pbxproj');
}
if (!androidCodeMatch) {
  throw new Error('versionCode not found in android/app/build.gradle');
}

const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
appJson.expo.version = packageVersion;
appJson.expo.ios.buildNumber = iosBuildMatch[1];
appJson.expo.android.versionCode = Number(androidCodeMatch[1]);

writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);

console.log(`app.json: version ${packageVersion}, ios.buildNumber ${iosBuildMatch[1]}, android.versionCode ${androidCodeMatch[1]}`);
