// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],

  app: {
    head: {
      link: [
        {
          rel: 'shortcut icon',
          href: 'data:,',
        },
      ],
    },
  },

  compatibilityDate: '2024-09-10',
})