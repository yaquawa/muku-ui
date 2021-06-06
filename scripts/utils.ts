import fs from 'fs'
import path from 'path'
import minimist from 'minimist'

export const argv = minimist(process.argv.slice(2))
export const packagesPath = path.resolve(__dirname + '/../packages/')
export const packageNames = argv._.length ? argv._ : getAllPackageNames()

export function assertPackageSpecified(packageName: string) {
  if (!fs.existsSync(`${packagesPath}/${packageName}`)) {
    throw new Error(`Incorrect package name '${packageName}'.`)
  }
}

export function getAllPackageNames() {
  return fs
    .readdirSync(packagesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}
