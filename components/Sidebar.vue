<template>
  <aside class="flex flex-col border m-2 h-[87vh] rounded-md shadow-md">
    <h2 class="text-xl font-bold my-4 text-center border-b" ><NuxtLink to="/staff">{{ title }}</NuxtLink></h2>
      <nav v-for="menu in menuNavigasi" class="space-y-1">
        <NuxtLink
          :to="menu.path"
          class="block py-2 px-10 rounded hover:bg-gray-300 transition duration-200"
        >
          {{ menu.label }}
        </NuxtLink>
      </nav>
  </aside>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    menuNavigasi: any;
    title: string;
  }>();
</script>

<style>

</style>