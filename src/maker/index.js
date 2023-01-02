import {program} from 'commander';
import appRootDir from 'app-root-dir';
import {copy} from 'fs-extra';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';

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

const updateAppName = async (appName) => {
  const replaceStringInFile = async (spec) => {
    try {
      const text = readFileSync(spec.file).toString();
      const updatedText = text.replace(spec.strTemplate, spec.strCustom);
      writeFileSync(spec.file, updatedText);
    } catch (error) {
      throw error;
    }
    return;
  };
  const androidResStringsXml = {
    file: `${appName}/android/app/src/main/res/values/strings.xml`,
    strTemplate: `<string name="app_name">${templateAppName}</string>`,
    strCustom: `<string name="app_name">${appName}</string>`,
  };
  const infoPlist = {
    file: `${appName}/ios/${templateAppName}/Info.plist`,
    strTemplate: `<string>${templateAppName}</string>`,
    strCustom: `<string>${appName}</string>`,
  };
  const launchScreenStoryboard = {
    file: `${appName}/ios/${templateAppName}/LaunchScreen.storyboard`,
    strTemplate: `text="${templateAppName}"`,
    strCustom: `text="${appName}"`,
  };
  try {
    await Promise.all([
      replaceStringInFile(androidResStringsXml),
      replaceStringInFile(infoPlist),
      replaceStringInFile(launchScreenStoryboard),
    ]);
  } catch (error) {
    throw error;
  }
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
