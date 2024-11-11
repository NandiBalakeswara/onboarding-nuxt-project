<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <Navbar :role="role" />
    </header>
    <!-- Role "Staff" -->
    <main v-if="role === 'Staff'" class="flex w-full">
      <!-- Sidebar dengan lebar 20% -->
      <aside class="w-[20%] min-w-[250px]">
        <Sidebar />
      </aside>
      
      <!-- Content area dengan lebar sisanya -->
      <div class="flex-1 p-5">
        <slot />
      </div>
    </main>
    <!-- role selain staff -->
    <main v-else class="max-w-4xl py-5 mx-auto">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
  import { useAuthStore } from "~/stores/auth/authStore";
  const authStore = useAuthStore();
  const role = ref('');

  onMounted(() => {
    role.value = authStore.isRoleSet;
  });
</script>

<style scoped></style>