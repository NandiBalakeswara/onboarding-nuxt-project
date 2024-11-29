<template>
  <div
    v-if="isVisible"
    class="fixed top-5 right-5 bg-opacity-90 px-4 py-2 rounded shadow-lg text-white"
    :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
  >
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success', // Bisa 'success' atau 'error'
  },
  duration: {
    type: Number,
    default: 3000, // Durasi alert (dalam milidetik)
  },
});

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
