import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  // browser-friendly (minified) UMD build
  {
    input: './index.js',
    // external: ['node-fetch'],
    output: {
      name: 'NEOS',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      nodePolyfills(),
      nodeGlobals({
        process: false,
        global: false,
        dirname: false,
        filename: false,
        baseDir: false
      }),
      terser()
    ]
  },
  {
    input: './index.js',
    output: {
      name: 'NEOS',
      file: 'docs/assets/neos.min.js',
      format: 'umd'
    },
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      nodePolyfills(),
      nodeGlobals({
        process: false,
        global: false,
        dirname: false,
        filename: false,
        baseDir: false
      }),
      terser()
    ]
  },
  // node js and module version
  {
    input: './index.js',
    external: [
      'fast-xml-parser',
      'json2xml',
      'unescape',
      'node-fetch'
    ],
    output: [{
      file: pkg.main,
      format: 'cjs',
      intro: 'var fetch = require(\'node-fetch\')'
    },
    {
      file: pkg.module,
      format: 'es'
    }
    ]
  }
]