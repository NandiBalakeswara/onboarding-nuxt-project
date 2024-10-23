import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'; // Mengimpor useStorage untuk menyimpan data secara reaktif di storage
import { useNuxtApp } from '#app'; // Mengimpor useNuxtApp untuk menggunakan plugin yang didefinisikan di Nuxt

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    
  }),
  getters: {
    isTokenSet() {
      const token = localStorage.getItem("token")
      return token !== null;
    },
  },
  
  actions: {
    async login(username: string, password: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/login", {
          username,
          password,
        });
        console.log(response.data);
        // Mendapatkan token, user detail, dan role dari response
        const token = response.data['token']; 
        const role = response.data['role']; 
        // Simpan token ke state
        this.token = token;
        // Simpan token ke localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        

        return {status: response.data['status'], role:role};
      } catch (error) {
        console.log(error.response.data['message']);
        return error.response.data['message'];
      }
    },

    async register(name: string, email: string, username: string, password: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/register", {
          name,
          email,
          username,
          password,
        });
        console.log(response.data);
        return response.data['status'];
      } catch (error) {
        console.log(error.response.data['message']);
        return error.response.data['message'];
      }
    },
    async logout() {
      const axiosInstance = useNuxtApp().$axios;
      try {
        await axiosInstance.post("/logout");
        // Reset state
        this.$reset();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } catch (error: any) {
        console.error("Kesalahan saat logout:", error);
      }
    },
  },
})
