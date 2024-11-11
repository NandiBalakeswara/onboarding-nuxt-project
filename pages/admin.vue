<template>
  <div>
    <div class="flex items-center justify-between gap-5">
      <div>
        <h1 class="text-2xl font-bold">Users</h1>
        <p class="mt-1 text-gray-500">Manage users here</p>
      </div>
      <!-- Tombol untuk menampilkan popup form add user -->
      <button class="bg-blue-500 rounded px-3 py-1 text-gray-50" @click="openAddModal">Add users</button>
    </div>
    <hr class="my-10" />
    
    <!-- Tabel user -->
    <div class="mt-5">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left text-gray-500 font-normal">Id</th>
            <th class="text-left text-gray-500 font-normal">Name</th>
            <th class="text-left text-gray-500 font-normal">Email</th>
            <th class="text-left text-gray-500 font-normal">Username</th>
            <th class="text-left text-gray-500 font-normal">Role</th>
            <th class="text-left text-gray-500 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t">
            <td class="px-4 py-2">{{ user.id }}</td>
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.username }}</td>
            <td class="px-4 py-2">{{ user.role }}</td>
            <td class="px-4 py-2">
              <button @click="openEditModal(user)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Modal Add/Edit User -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-5 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit User' : 'Add User' }}</h2>
        <form @submit.prevent="isEdit ? updateUser() : createUser()">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input v-model="userForm.name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input v-model="userForm.email" type="email" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Username</label>
            <input v-model="userForm.username" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4" v-if="!isEdit">
            <label class="block text-gray-700">Password</label>
            <input v-model="userForm.password" type="password" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Role</label>
            <select v-model="userForm.role" class="w-full p-2 border rounded" required>
              <option value="" disabled>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Dummy">Dummy</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="bg-gray-500 text-white px-3 py-1 rounded mr-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">{{ isEdit ? 'Update User' : 'Add User' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-middleware', 'role-middleware'], // Menggunakan middleware roleMiddleware
    requiredRole: 'Admin',          // Role yang dibutuhkan adalah 'admin'
});

import { ref, onMounted } from 'vue';
import { useAdminStore } from '~/stores/admin/adminStore'; // Import adminStore

// Inisialisasi store
const adminStore = useAdminStore();

// State untuk mengelola modal dan data pengguna
const isModalOpen = ref(false);
const isEdit = ref(false);
const users = ref([]);
const userForm = ref({ id: null, name: '', email: '', username: '', password: '', role: '' });

// Fetch data users dari backend
const fetchUsers = async () => {
  const status = await adminStore.fetchUsers();
  if (status === 'success') {
    // Update users hanya jika fetch berhasil
    users.value = adminStore.getUsers;
  } else {
    console.error('Failed to fetch users:', status);
  }
};

// Membuka modal untuk menambah user
const openAddModal = () => {
  userForm.value = { id: null, name: '', email: '', username: '', password: '', role: '' };
  isEdit.value = false;
  isModalOpen.value = true;
};

// Membuka modal untuk mengedit user
const openEditModal = (user) => {
  userForm.value = { ...user, password: '' }; // Kosongkan password untuk keamanan
  isEdit.value = true;
  isModalOpen.value = true;
};

// Menutup modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Fungsi untuk menambah user baru
const createUser = async () => {
  const status = await adminStore.registerUser(userForm.value.username, userForm.value.email, userForm.value.name, userForm.value.role, userForm.value.password);
  if (status === 'success') {
    closeModal();
    await fetchUsers(); // Refresh daftar pengguna
  } else {
    console.error('Failed to create user:', status);
  }
};

// Fungsi untuk mengupdate user
const updateUser = async () => {
  const status = await adminStore.modifyUser(userForm.value.id, userForm.value.username, userForm.value.email, userForm.value.name, userForm.value.role);
  if (status === 'success') {
    closeModal();
    await fetchUsers(); // Refresh daftar pengguna
  } else {
    console.error('Failed to update user:', status);
  }
};

// Fungsi untuk menghapus user
const deleteUser = async (id) => {
  const status = await adminStore.deleteUser(id);
  if (status === 'success') {
    await fetchUsers(); // Refresh daftar pengguna
  } else {
    console.error('Failed to delete user:', status);
  }
};

// Saat komponen di-mount, fetch data user
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Tambahkan styling sesuai kebutuhan */
</style>
