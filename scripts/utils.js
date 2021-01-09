import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
export const argv = minimist(process.argv.slice(2))
export const packagesPath = path.resolve(__dirname + '/../packages/')
export const packageNames = argv._.length ? argv._ : getAllPackageNames()

export function assertPackageSpecified(packageName) {
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
