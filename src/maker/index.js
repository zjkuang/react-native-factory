import {program} from 'commander';
import appRootDir from 'app-root-dir';
import fs from 'fs';

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

const createApp = (args) => {
  const appName = args.appName;
  if (!appName || String(appName).trim() === '') {
    console.log('Missing app name.');
    return;
  }
  if (fs.existsSync(appName)) {
    console.log(`${appName} already exists in current directory.`);
    return;
  }
  const template = args.template || 'default';
  const validTemplates = ['default'];
  if (!validTemplates.includes(template)) {
    console.log(`Unknown template: ${template}`);
  }
  fs.mkdirSync(appName);
  const templatesDir = appRootDir.get() + '/node_modules/@zjkuang/react-native-factory/template-apps';
  let templateDir;
  if (template === 'default') {
    templateDir = templatesDir + '/default';
  }
  console.log(`Creating app from template location ${templateDir}`);
};

export const make = () => {
  const args = parseArgs();
  console.log(`>>> app: ${args.appName}, template: ${args.template}`);
  createApp(args);
};
