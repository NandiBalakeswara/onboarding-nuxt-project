<template>
  <div>
    Dummy
    <button @click="logout">logout</button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth-middleware',
});
import { useAuthStore } from "~/stores/auth/authStore";
const authStore = useAuthStore();

const logout = async () => {
  console.log('logout')
  await authStore.logout();
  navigateTo('/login');
};
</script>

<style>

</style>