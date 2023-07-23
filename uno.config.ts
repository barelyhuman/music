// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetAttributify({}), presetUno()],
  theme: {
    colors: {
      gray: 'var(--gray)',
      light: 'var(--light)',
      dark: 'var(--dark)',
    },
  },
})
