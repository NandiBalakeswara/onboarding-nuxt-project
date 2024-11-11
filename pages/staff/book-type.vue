<template>
  <div class="px-10">
    <div class="flex items-center justify-between gap-5">
      <div>
        <h1 class="text-2xl font-bold">Book Type</h1>
        <p class="mt-1 text-gray-500">Manage book-type here</p>
      </div>
      <!-- Tombol untuk menampilkan popup form add user -->
      <button class="bg-blue-500 rounded px-3 py-1 text-gray-50">Add</button>
    </div>
    <hr class="my-7" />
    
    <!-- Tabel user -->

    <!-- Popup Modal Add/Edit User -->
    
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: ['auth-middleware', 'role-middleware'], // Menggunakan middleware roleMiddleware
    requiredRole: 'Staff',          // Role yang dibutuhkan adalah 'admin'
});
</script>

<style>

</style>