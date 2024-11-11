// plugins/axios.ts
import { defineNuxtPlugin } from '#app'
import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  

  const axiosInstance = axios.create({
    baseURL: config.public.apiUrl,
    timeout: 60000,
    // withCredentials: true, // Mengizinkan pengiriman kredensial seperti cookie
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
  })

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      console.log(token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const router = useRouter()
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )

  nuxtApp.provide('axios', axiosInstance)
})
