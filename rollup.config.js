import fs from 'fs'
import path from 'path'
import sass from 'sass'
import vuePlugin from 'rollup-plugin-vue'
import dtsPlugin from 'rollup-plugin-dts'
import scssPlugin from 'rollup-plugin-scss'
import tsPlugin from 'rollup-plugin-typescript2'
import resolveNodePlugin from '@rollup/plugin-node-resolve'
import injectProcessEnvPlugin from 'rollup-plugin-inject-process-env'
import { kebabCase, camelCase, upperFirst } from 'lodash'

const packageName = kebabCase(process.env.PACKAGE)

if (!packageName) {
  throw new Error('No package specified.')
}

const packagePath = path.resolve(__dirname, 'packages', packageName)
const srcIndexPath = path.resolve(packagePath, 'src/index.ts')
const demoIndexPath = path.resolve(packagePath, 'demo/index.ts')

if (!fs.existsSync(packagePath)) {
  throw new Error('Incorrect package name.')
}

const formats = process.env.FORMATS?.split('+') || ['es', 'cjs', 'iife']

const basicConfig = process.env.DEMO ? createConfig(demoIndexPath, 'demo') : createConfig(srcIndexPath)

const configs = [basicConfig]

if (process.env.BUILD_TYPES) {
  const typeConfig = {
    input: `${packagePath}/dist/types/${packageName}/src/index.d.ts`,
    output: {
      file: `${packagePath}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [dtsPlugin()],
  }

  configs.push(typeConfig)
}

export default configs

function createConfig(entryFilePath, outFileBaseName = null, options = {}) {
  outFileBaseName = outFileBaseName || path.basename(entryFilePath, '.ts')

  return {
    input: entryFilePath,
    output: formats.map((format) => createOutputConfig(outFileBaseName, format)),
    plugins: [
      tsPlugin({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: `${packagePath}/dist/types`,
          },
        },
      }),
      scssPlugin({
        sass,
        output: `${packagePath}/dist/${outFileBaseName}.css`,
      }),
      vuePlugin(),
      injectProcessEnvPlugin({
        NODE_ENV: process.env.NODE_ENV,
      }),
      resolveNodePlugin(),
    ],
    external: ['vue'],
    ...options,
  }
}

function createOutputConfig(outFileBaseName, format) {
  const outputConfig = {
    file: `${packagePath}/dist/${outFileBaseName}.${format}.js`,
    sourcemap: true,
    externalLiveBindings: false,
    format,
  }

  if (format === 'iife') {
    outputConfig.name = 'Muku' + upperFirst(camelCase(packageName))
    outputConfig.globals = {
      vue: 'Vue',
    }
  }

  return outputConfig
}
