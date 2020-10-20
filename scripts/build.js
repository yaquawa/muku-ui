import fs from 'fs-extra';
import execa from 'execa';
import { packageName, packagePath, argv, assertPackageSpecified } from './utils.js';

assertPackageSpecified();

/*
|---------------------------------------------------------------------------
| Usage
|---------------------------------------------------------------------------
| yarn build <PACKAGE_NAME> [-f|--formats FORMATS] [--demo] [-w|--watch]
|
| e.g. Build `modal` package.
| yarn build modal --formats=es+iife
|
| e.g. Build `demo/index.ts` of the `modal` package.
| yarn build modal --formats=iife --demo
|
*/

const formats = argv.formats || argv.f || 'es+cjs+iife';

cleanBuilds();
buildScripts();
buildStyle();

async function buildScripts() {
  const buildDemo = argv.demo;
  const shouldWatch = argv.w || argv.watch;
  const rollupEnv = [`PACKAGE:${packageName}`, `FORMATS:${formats}`];

  if (buildDemo) {
    rollupEnv.push('DEMO');
  }

  if (!shouldWatch && !buildDemo) {
    rollupEnv.push('BUILD_TYPES');
  }

  const rollupArgs = ['-c', '--environment', rollupEnv.filter(Boolean).join(',')];

  if (shouldWatch) {
    rollupArgs.push('--watch');
  }

  await execa('rollup', rollupArgs, {
    stdio: 'inherit',
  });
}

function buildStyle() {
  const stylePath = `${packagePath}/assets/style.scss`;
  const outputStylePath = `${packagePath}/dist/style.css`;

  if (!fs.pathExistsSync(stylePath)) {
    return;
  }

  const sassArgs = [stylePath, outputStylePath];

  if (argv.watch) {
    sassArgs.push('--watch');
  }

  execa('sass', sassArgs, {
    stdio: 'inherit',
  });
}

function cleanBuilds() {
  const distDir = `${packagePath}/dist`;
  fs.removeSync(distDir);
}
