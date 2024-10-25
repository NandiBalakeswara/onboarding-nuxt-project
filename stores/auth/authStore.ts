// stores/authStore.ts
import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies' // Menggunakan cookies
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
  }),

  getters: {
    isTokenSet() {
      const token = useCookies().get('token')
      return token !== null
    },
  },

  actions: {
    async login(username: string, password: string) {
      const axiosInstance = useNuxtApp().$axios
      const cookies = useCookies()

      try {
        const response = await axiosInstance.post('/login', { username, password })
        const { token, role } = response.data

        // Set token dan role di state dan cookies
        cookies.set('token', token, { path: '/', sameSite: 'strict' })
        return { status: response.data.status, role }
      } catch (error) {
        console.log(error.response?.data.message || 'Login failed')
        return error.response?.data.message || 'Login failed'
      }
    },

    async register(name: string, email: string, username: string, password: string) {
      const axiosInstance = useNuxtApp().$axios

      try {
        const response = await axiosInstance.post('/register', {
          name,
          email,
          username,
          password,
        })
        return response.data.status
      } catch (error) {
        console.log(error.response?.data.message || 'Registration failed')
        return error.response?.data.message || 'Registration failed'
      }
    },

    async logout() {
      const axiosInstance = useNuxtApp().$axios
      const cookies = useCookies()

      try {
        await axiosInstance.post('/logout')

        // Reset state dan hapus cookies
        this.$reset()
        cookies.remove('token')
        cookies.remove('role')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
  },
})
