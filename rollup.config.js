import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  // browser-friendly (minified) UMD build
  {
    input: './index.js',
    output: {
      name: 'NEOS',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'node-fetch': 'fetch'
      }
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      nodePolyfills(),
      terser()
    ]
  },
  {
    input: './index.js',
    output: {
      name: 'NEOS',
      file: 'docs/assets/neos.min.js',
      format: 'umd',
      globals: {
        'node-fetch': 'fetch'
      }
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      nodePolyfills(),
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
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
    ]
  }
]