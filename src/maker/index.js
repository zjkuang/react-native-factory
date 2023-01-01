import {program} from 'commander';
import appRootDir from 'app-root-dir';
import {copy} from 'fs-extra';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';

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

const updateAppName = async (appName) => {
  const infoPlist = `${appName}/ios/app/info.plist`;
  const launchScreenStoryboard = `${appName}/ios/app/LaunchScreen.storyboard`;
  try {
    const [infoPlistText, launchScreenStoryboardText] = await Promise.all([
      readFileSync(infoPlist).toString(),
      readFileSync(launchScreenStoryboard).toString(),
    ]);
    const [updatedInfoPlistText, updatedLaunchScreenStoryboardText] = [
      infoPlistText.replace('<string>app</string>', `<string>${appName}</string>`),
      launchScreenStoryboardText.replace('text="app"', `text="${appName}"`),
    ];
    writeFileSync(infoPlist, updatedInfoPlistText);
    writeFileSync(launchScreenStoryboard, updatedLaunchScreenStoryboardText);
  } catch (error) {
    throw error;
  }
  return;
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
    templateDir = templatesDir + '/default/app';
  }

  console.log(`Creating app from template location ${templateDir}`);

  let finished = false;
  let count = 0;
  let hourglass = setInterval(async () => {
    if (finished) {
      clearInterval(hourglass);
      await updateAppName(appName);
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
    await copy(templateDir, appName);
  } catch (error) {
    console.log(`Failed. ${JSON.stringify(error)}`);
  }
  finished = true;
};

export const make = () => {
  const args = parseArgs();
  console.log(`>>> app: ${args.appName}, template: ${args.template}`);
  createApp(args);
};
