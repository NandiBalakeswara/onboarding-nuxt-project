import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const role = localStorage.getItem('role');
    console.log(role);
    const requiredRole = to.meta.requiredRole;

    if (role !== requiredRole) {
      return navigateTo('/'); // Arahkan ke halaman jika role tidak sesuai
    }
  }
});
