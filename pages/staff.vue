<template>
  <div>
    Staff
    <button @click="logout">logout</button>
  </div>
</template>

<script lang="ts" setup>

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