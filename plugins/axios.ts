// plugins/axios.ts
import { defineNuxtPlugin } from '#app'
import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const cookies = useCookies()

  const axiosInstance = axios.create({
    baseURL: config.public.apiUrl,
    timeout: 60000,
    headers: { accept: 'application/json' },
  })

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = cookies.get('token')
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
