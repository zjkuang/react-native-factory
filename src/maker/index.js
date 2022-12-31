import {program} from 'commander';
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

export const make = () => {
  const args = parseArgs();
  console.log(`>>> app: ${args.appName}, template: ${args.template}`);
};
