import {useAuthStore} from '~/stores/auth/authStore';
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore(); // Mengakses store otentikasi
    // Pastikan localStorage hanya diakses di client-side
    if (process.client) {
      const token = authStore.isTokenSet;
      console.log(token)
      // Jika tidak ada token, arahkan ke halaman login
      if (!token) {
        return navigateTo('/login');
      }
    }
  });

  
  