<!-- components/Navbar.vue -->
<template>
  <div class="z-20 border-b bg-background/90 backdrop-blur sticky top-0 flex justify-center">
    <div class="flex h-14 items-center justify-between w-[80%]">
      <p class="text-large font-semibold">{{ props.role }}</p>
      <div class="flex items-center gap-2">
        <button class="border border-gray-500 rounded px-3 py-1" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth/authStore";

const props = defineProps<{
  role: string
}>();

const authStore = useAuthStore();

const logout = async () => {
  console.log('logout')
  await authStore.logout();
  navigateTo('/login');
};
</script>