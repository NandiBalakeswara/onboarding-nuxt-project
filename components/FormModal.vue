<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-5 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <form @submit.prevent="$emit('submit', formData)">
        <div v-for="(field, index) in fields" :key="index" class="mb-4">
          <label :for="field.key" class="block text-gray-700">{{ field.label }}</label>
          <template v-if="field.type === 'select'">
            <select v-model="formData[field.key]" :id="field.key" class="w-full p-2 border rounded" required>
              <option value="Admin" disabled>Select Role</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </template>
          <template v-else>
            <input
              v-model="formData[field.key]"
              :type="field.type"
              :id="field.key"
              class="w-full p-2 border rounded"
              required
            />
          </template>
        </div>
        <div class="flex justify-end">
          <button type="button" @click="$emit('close')" class="bg-gray-500 text-white px-3 py-1 rounded mr-2">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">{{ submitLabel }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue';

interface Field {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[]; // Tambahkan opsi jika type adalah select
}

const props = defineProps<{
  isOpen: boolean;
  title: string;
  submitLabel: string;
  fields: Field[];
  initialData: Record<string, any>;
}>();

const formData = ref({ ...props.initialData });

watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData };
  },
  { immediate: true }
);

</script>