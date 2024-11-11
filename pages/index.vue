<template>
  <div >
    <h1>Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
  </div>
</template>

<script setup>
  definePageMeta({
    middleware: 'auth-middleware',
    layout: 'login'
  })
</script>

<style scoped>
/* Anda bisa menambahkan style tambahan jika diperlukan */
</style>
