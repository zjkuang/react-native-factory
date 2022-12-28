const appLocation = () => {
  const dir = __dirname
  .replace('/node_modules/@local/commonjs-utils', '') // local `npx .`
  .replace('/packages/commonjs-utils', ''); // remote `npx <app-package>`
  return dir;
}

module.exports = {
  appLocation,
}
