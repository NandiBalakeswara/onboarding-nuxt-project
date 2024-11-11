<template>
  <div>
    <h1>Dhasboard Staff</h1>
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