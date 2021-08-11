import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import alias from '@rollup/plugin-alias';
import buble from '@rollup/plugin-buble';
import replace from '@rollup/plugin-replace';
import generatePackageJson from 'rollup-plugin-generate-package-json'

const outDir = 'dist/';
const fileName = 'google-api-tools';
const moduleName = 'GoogleApiTools';
const pkg = require('./package.json');

export default [
  {
    input: './src/index.ts',
    output: [
      {
        format: 'esm',
        file: `${outDir}${fileName}.esm.js`,
        exports: 'named',
        name: moduleName,
      },
      {
        format: 'cjs',
        file: `${outDir}${fileName}.js`,
        exports: 'named',
        name: moduleName,
      },
    ],
    plugins: [
      replace({ 'process.env.NODE_ENV': '"production"' }),
      commonjs(),
      alias({
        resolve: ['.ts'],
      }),
      typescript({
        tsconfig: false,
        experimentalDecorators: true,
        module: 'es2015'
      }),
      buble(),
      generatePackageJson({
        baseContents: {
          'name': pkg.name,
          'version': pkg.version,
          'repository': pkg.repository,
          "license": "MIT",
          'main': `./${fileName}.js`,
          'module': `./${fileName}.esm.js`
        }
      }),
      copy({
        targets: [
          { src: [ 'README.md', 'LICENSE' ], dest: 'dist' },
        ]
      }),
    ]
  },
]
