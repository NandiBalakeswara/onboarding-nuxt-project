import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth/authStore';

export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const role = localStorage.getItem('role');
    console.log(role);
    const requiredRole = to.meta.requiredRole;

    if (role !== requiredRole) {
      useAuthStore().logout();
      return navigateTo('/login'); // Arahkan ke halaman jika role tidak sesuai
    }
  }
});
