import execa from 'execa'
import browserSync, { BrowserSyncInstance } from 'browser-sync'
import { packageNames, packagesPath, assertPackageSpecified } from './utils'

const packageName = packageNames[0]
const packagePath = `${packagesPath}/${packageName}`
assertPackageSpecified(packageName)

buildDemo().then(runBrowserSync)

function runBrowserSync() {
  const demoDir = `${packagePath}/demo`
  const distDir = `${packagePath}/dist`

  browserSync({
    server: demoDir,
    serveStatic: [distDir],
    files: [
      `${distDir}/*.(js|css)`,
      `${demoDir}/*.html`,
      {
        match: [`${demoDir}/*.(ts|vue)`, `${packagePath}/src/**/*.(ts|vue)`],
        fn: async function (this: BrowserSyncInstance, event, file) {
          console.log(`Recompile file: ${file}`)

          await buildDemo()
          this.reload()
        },
      },
    ],
  })
}

function buildDemo() {
  console.log(`Building ${packageName} demo...`)
  return execa('yarn', ['ts', `${__dirname}/build.ts`, packageName, '--demo', '--formats=iife'], {
    stdio: 'inherit',
  })
}
