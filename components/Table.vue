<!-- components/Table.vue -->
<template>
  <table class="w-full">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" class="text-left text-gray-500 font-normal">
          {{ column.label }}
        </th>
        <th class="text-left text-gray-500 font-normal">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id" class="border-t">
        <td v-for="column in columns" :key="column.key" class="px-4 py-2">
          {{ row[column.key] }}
        </td>
        <td class="px-4 py-2">
          <button @click="$emit('edit', row)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
          <button @click="$emit('delete', row.id)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

interface Column {
  key: string;
  label: string;
}

const props = defineProps<{
  columns: Column[];
  rows: Array<Record<string, any>>;
}>();

const emits = defineEmits(['edit', 'delete']);
</script>
