import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const output = {
  format: 'umd',
  globals: {
    codemirror: 'CodeMirror'
  },
  name: "CodeMirrorAVS"
};

const plugins = [
  commonjs(),
  json()
];

export default [
  {
    input: 'src/avs.js',
    output: {
      ...output,
      file: 'dist/avs.js',
    },
    plugins: plugins
  },
  {
    input: 'src/avs.js',
    output: {
      ...output,
      file: 'dist/avs.min.js'
    },
    plugins: [
      ...plugins,
      terser()
    ]
  }
];
