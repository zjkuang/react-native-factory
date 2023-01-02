#!/usr/bin/env node

import appRootDir from 'app-root-dir';
import {make} from './src/maker/index.js';

// console.log('bin.js > Hello, world!');

// console.log(`appRootDir=${appRootDir.get()}`);
// console.log(`cwd=${process.cwd()}`);

make();
