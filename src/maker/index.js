import {program} from 'commander';
import appRootDir from 'app-root-dir';
import {copy} from 'fs-extra';
import {existsSync, mkdirSync, readFileSync, writeFileSync, renameSync} from 'fs';

const templateAppName = 'zjkuangrntemplateapp';

const parseArgs = () => {
  const result = {};
  program
  .name('@zjkuang/react-native-factory')
  .description('Create a React Native project in TypeScript with specific template.')
  .usage('npx @zjkuang/react-native-factory init <app-name> [--template {default|<other>}]');
  program
  .command('init <app>')
  .option('-t, --template <template>', 'app template')
  .action((app, options) => {
    // $ npx . init MyApp --template default
    // >>> app: MyApp, options: {"template":"default"}
    // console.log(`>>> app: ${app}, options: ${JSON.stringify(options)}`); // app: MyApp, options: {"template":"default"}
    result.appName = app;
    result.template = options.template;
  });
  program.parse();
  return result;
};

const updateAppName = (appName) => {
  process.stdout.write('Updating app name...');

  renameSync(`${appName}/android/app/src/main/java/com/${templateAppName}`, `${appName}/android/app/src/main/java/com/${appName}`);
  renameSync(`${appName}/android/app/src/debug/java/com/${templateAppName}`, `${appName}/android/app/src/debug/java/com/${appName}`);
  renameSync(`${appName}/ios/${templateAppName}`, `${appName}/ios/${appName}`);
  renameSync(`${appName}/ios/${templateAppName}.xcodeproj`, `${appName}/ios/${appName}.xcodeproj`);
  renameSync(`${appName}/ios/${templateAppName}.xcworkspace`, `${appName}/ios/${appName}.xcworkspace`);
  renameSync(`${appName}/ios/${templateAppName}Tests`, `${appName}/ios/${appName}Tests`);
  
  const files = [
    'app.json',
    'package.json',
    'android/app/src/main/res/values/strings.xml',
    'android/settings.gradle',
    'android/app/_BUCK',
    'android/app/build.gradle',
    `android/app/src/debug/java/com/${appName}/ReactNativeFlipper.java`,
    'android/app/src/main/AndroidManifest.xml',
    `android/app/src/main/java/com/${appName}/MainActivity.java`,
    `android/app/src/main/java/com/${appName}/MainApplication.java`,
    `android/app/src/main/java/com/${appName}/newarchitecture/MainApplicationReactNativeHost.java`,
    `android/app/src/main/java/com/${appName}/newarchitecture/components/MainComponentsRegistry.java`,
    `android/app/src/main/java/com/${appName}/newarchitecture/modules/MainApplicationTurboModuleManagerDelegate.java`,
    'android/app/src/main/jni/CMakeLists.txt',
    'android/app/src/main/jni/MainApplicationTurboModuleManagerDelegate.h',
    'android/app/src/main/jni/MainComponentsRegistry.h',
    `ios/${appName}/Info.plist`,
    `ios/${appName}/LaunchScreen.storyboard`,
    'ios/Podfile',
    `ios/${appName}/AppDelegate.mm`,
    `ios/${appName}.xcodeproj/project.pbxproj`,
    `ios/${appName}.xcodeproj/xcshareddata/xcschemes/${appName}.xcscheme`,
    `ios/${appName}.xcworkspace/contents.xcworkspacedata`,
    `ios/${appName}Tests/${appName}Tests.m`,
  ];
  files.forEach((_file) => {
    const file = `${appName}/` + _file;
    if (existsSync(file)) {
      const text = readFileSync(file).toString();
      const updatedText = text.split(templateAppName).join(appName);
      writeFileSync(file, updatedText);
    }
  });

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('App name updated.\n');
};

const createApp = async (args) => {
  const appName = args.appName;
  if (!appName || String(appName).trim() === '') {
    console.log('Missing app name.');
    return;
  }
  if (existsSync(appName)) {
    console.log(`${appName} already exists in current directory.`);
    return;
  }
  const template = args.template || 'default';
  const validTemplates = ['default'];
  if (!validTemplates.includes(template)) {
    console.log(`Unknown template: ${template}`);
  }
  mkdirSync(appName);
  const templatesDir = appRootDir.get() + '/node_modules/@zjkuang/react-native-factory/template-apps';
  let templateDir;
  if (template === 'default') {
    templateDir = templatesDir + `/default/${templateAppName}`;
  }

  let finished = false;
  let count = 0;
  let hourglass = setInterval(async () => {
    if (finished) {
      clearInterval(hourglass);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.log('Template app cloned.');
      updateAppName(appName);
      console.log('Done!');
      return;
    }
    count++;
    if (count >= 4) {
      count = 0;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    } else {
      process.stdout.write('.');
    }
  }, 500);
  try {
    copy(templateDir, appName);
  } catch (error) {
    console.log(`Failed. ${JSON.stringify(error)}`);
  }
  finished = true;
};

export const make = () => {
  const args = parseArgs();
  createApp(args);
};
