import { defineNuxtPlugin } from '#app'
import axios from 'axios'
export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig()

    const axiosInstance = axios.create({
        baseURL: config.public.apiUrl,
        timeout: 60000,// 60 seconds
        headers: {
            accept: 'application/json',
        },
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response.status === 401) {
                const router = useRouter();
                router.push('/login');
            }
            return Promise.reject(error)
        }
    )

    nuxtApp.provide('axios', axiosInstance)
})
