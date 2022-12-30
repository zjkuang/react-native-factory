#!/usr/bin/env node

import appRootDir from 'app-root-dir';

console.log('bin.js > Hello, world!');

console.log(`appRootDir=${appRootDir.get()}`);
