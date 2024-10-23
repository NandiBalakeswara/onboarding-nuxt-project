<template>
  <div>
    <div class="z-20 border-b bg-background/90 backdrop-blur sticky top-0 flex justify-center">
      <div class="flex h-14 items-center justify-between w-[80%]">
        <p class="text-large font-semibold">Admin</p>
        <div class="flex items-center gap-2">
          <button class="border border-gray-500 rounded px-3 py-1" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <section class="max-w-4xl py-5 mx-auto">
      <AdminUsers />
    </section>
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