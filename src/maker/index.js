import {program} from 'commander';
import fs from 'fs';

export const make = () => {
  program
  .name('@zjkuang/react-native-factory')
  .description('Create a React Native project in TypeScript with specific template.')
  .usage('npx @zjkuang/react-native-factory init <app-name> [--template {default|<other>}]')
  .option('--template <template>', 'app template')
  .command('init <project>')
  .action((project, template) => {
    console.log(`project: ${project}, template: ${template}`);
  })
};
