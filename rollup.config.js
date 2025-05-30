import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default async () => {
  const tailwindcss = (await import('tailwindcss')).default;
  const autoprefixer = (await import('autoprefixer')).default;

  return {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        'tests/**/*',
        'examples/**/*',
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: { node: '16' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }),
    postcss({
      extract: 'styles.css',
      minimize: true,
      sourceMap: true,
      use: {
        sass: false,
        stylus: false,
        less: false,
      },
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    }),
    copy({
      targets: [
        { src: 'src/styles/index.css', dest: 'dist', rename: 'styles.css' },
      ],
    }),
  ],
  external: [
    'react',
    'react-dom',
    'firebase/app',
    'firebase/firestore',
    'firebase/storage',
    'react-hot-toast',
  ],
  };
};