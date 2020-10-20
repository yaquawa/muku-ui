import execa from 'execa';
import browserSync from 'browser-sync';
import { packagePath, assertPackageSpecified, __dirname, packageName } from './utils.js';

assertPackageSpecified();

buildDemo();
runBrowserSync();

function runBrowserSync() {
  const demoDir = `${packagePath}/demo`;
  const distDir = `${packagePath}/dist`;

  browserSync({
    server: demoDir,
    serveStatic: [distDir],
    files: [
      `${distDir}/*.(js|css)`,
      `${demoDir}/*.html`,
      {
        match: [`${demoDir}/*.(ts|vue)`, `${packagePath}/src/**/*.(ts|vue)`],
        fn: async function (event, file) {
          console.log(`Recompile file: ${file}`);

          await buildDemo();
          this.reload();
        },
      },
    ],
  });
}

function buildDemo() {
  console.log('Building demo...');
  return execa('node', [__dirname + '/build.js', packageName, '--demo', '--formats=iife'], {
    stdio: 'inherit',
  });
}
