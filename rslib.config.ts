import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      index: ['./src/index.ts']
    }
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm'
    }
  ],
  output: {
    target: 'web'
  },

  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.(vert|frag)$/,
            type: 'asset/source'
          }
        ]
      }
    }
  }
})
