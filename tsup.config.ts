import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: './dist',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  /**
   * Workaround for Dynamic require of "x" is not supported
   *
   * @see https://github.com/egoist/tsup/issues/927
   */
  banner: ({ format }) => {
    if (format === 'esm') {
      const declarations = [
        `import { fileURLToPath } from 'url'; const __filename = fileURLToPath(import.meta.url);`,
        `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      ]

      return ({
        js: declarations.join(''),
      })
    }
  },
})
