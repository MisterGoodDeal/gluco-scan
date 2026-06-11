import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appJsonPath = join(root, 'app.json');
const packageJsonPath = join(root, 'package.json');
const pbxprojPath = join(root, 'ios/glucoscan.xcodeproj/project.pbxproj');
const buildGradlePath = join(root, 'android/app/build.gradle');

const pbxproj = readFileSync(pbxprojPath, 'utf8');
const buildGradle = readFileSync(buildGradlePath, 'utf8');

const marketingMatch = pbxproj.match(/MARKETING_VERSION = ([^;]+);/);
const iosBuildMatch = pbxproj.match(/CURRENT_PROJECT_VERSION = (\d+);/);
const androidCodeMatch = buildGradle.match(/versionCode (\d+)/);
const androidNameMatch = buildGradle.match(/versionName ["']([^"']+)["']/);

if (!marketingMatch) {
  throw new Error('MARKETING_VERSION not found in project.pbxproj');
}
if (!iosBuildMatch) {
  throw new Error('CURRENT_PROJECT_VERSION not found in project.pbxproj');
}
if (!androidCodeMatch) {
  throw new Error('versionCode not found in android/app/build.gradle');
}

const version = marketingMatch[1].trim();
const iosBuildNumber = iosBuildMatch[1];
const androidVersionCode = Number(androidCodeMatch[1]);

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = version;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
appJson.expo.version = version;
appJson.expo.ios.buildNumber = iosBuildNumber;
appJson.expo.android.versionCode = androidVersionCode;
writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);

const androidVersionName = androidNameMatch?.[1] ?? version;
if (androidVersionName !== version) {
  console.warn(`Warning: android versionName (${androidVersionName}) differs from MARKETING_VERSION (${version})`);
}

console.log(
  `Synced versions → package.json ${version}, app.json ${version}, ios.buildNumber ${iosBuildNumber}, android.versionCode ${androidVersionCode}`,
);
