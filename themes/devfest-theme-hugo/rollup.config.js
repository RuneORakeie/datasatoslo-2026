import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

// Replace the custom logger with a simpler console-based warning
function logWarning(warning) {
    console.warn(warning.message);
    if (warning.loc) {
        console.warn(`${warning.loc.file}:${warning.loc.line}:${warning.loc.column}`);
    }
    if (warning.frame) {
        console.warn(warning.frame);
    }
}

const globals = { firebase: 'firebase' };

export default {
  input: 'src/scripts/main.js',
  output: [
    {
      file: 'static/theme.js',
      format: 'esm',
      globals,
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    process.env.NODE_ENV === 'production' && terser()
  ],
  external: [
    'firebase',
    'firebase/firestore'
  ],
  onwarn(warning) {
    logWarning(warning);
  }
};