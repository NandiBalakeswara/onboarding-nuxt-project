// stores/authStore.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
  }),

  getters: {
    isTokenSet() {
       const token = localStorage.getItem("token")
       return token !== null;
    },
    isRoleSet() {
      const role = localStorage.getItem("role")
      if (role !== null) {
        return role;
      }
    }
  },

  actions: {
    async login(username: string, password: string) {
      const axiosInstance = useNuxtApp().$axios
  
      console.log(username, password)
      try {
        const response = await axiosInstance.post('/login', { username, password })
        const { token, role } = response.data
        console.log(response)
        // Set token dan role di localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)

        console.log(localStorage)
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
      try {
        await axiosInstance.post('/logout')

        // Reset state dan hapus token dari localStorage
        this.$reset()
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
  },
})
