// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  server: {
    port: 3000, // Tentukan port di sini
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
        apiUrl: 'http://localhost:8000',
    },
    app: {
        baseURL: "/",
    },
 },
})