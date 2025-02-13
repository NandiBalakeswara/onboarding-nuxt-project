import type { Config } from 'tailwindcss';

export default <Partial<Config>> {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue', // sesuaikan dengan file utama Nuxt Anda
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
