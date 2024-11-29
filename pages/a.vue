<template>
  <div>
    <div class="flex items-center justify-between gap-5">
      <div>
        <h1 class="text-2xl font-bold">Users</h1>
        <p class="mt-1 text-gray-500">Manage users here</p>
      </div>
      <button class="bg-blue-500 rounded px-3 py-1 text-gray-50" @click="openAddModal">Add User</button>
    </div>
    <hr class="my-10" />

    <!-- Tabel user -->
    <Table
      :columns="columns"
      :rows="users"
      @edit="openEditModal"
      @delete="deleteUser"
    />

    <!-- Popup Modal Add/Edit User -->
    <FormModal
      :isOpen="isModalOpen"
      :title="isEdit ? 'Edit User' : 'Add User'"
      :submitLabel="isEdit ? 'Update User' : 'Add User'"
      :fields="filteredFields"
      :initialData="userForm"
      @submit="handleSubmit"
      @close="closeModal"
    />

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-middleware', 'role-middleware'], // Menggunakan middleware roleMiddleware
    requiredRole: 'Admin',          // Role yang dibutuhkan adalah 'admin'
});

import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '~/stores/admin/adminStore'; // Import adminStore

// Inisialisasi store
const adminStore = useAdminStore();
// State untuk mengelola modal dan data pengguna
const isModalOpen = ref(false);
const isEdit = ref(false);
const users = ref([]);
const userForm = ref({ id: null, name: '', email: '', username: '', password: '', role: '' });


// Data for the table and form fields
const columns = [
  { key: 'id', label: 'Id' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'username', label: 'Username' },
  { key: 'role', label: 'Role' },
];

const fields = ref([
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'username', label: 'Username', type: 'text' },
  { 
    key: 'password', 
    label: 'Password', 
    type: 'password', 
    show: () => !isEdit.value // Show only if not in edit mode
  },
  { 
    key: 'role', 
    label: 'Role', 
    type: 'select', 
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'Staff', label: 'Staff' },
      { value: 'Dummy', label: 'Dummy' },
    ]
  },
]);

// Filter fields to hide password when editing
const filteredFields = computed(() => fields.value.filter(field => field.show ? field.show() : true));

const handleSubmit = (formData) => {
  console.log('Form Data before submission:', formData);
  if (isEdit.value) {
    updateUser(formData);
  } else {
    createUser(formData);
  }
};


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
const createUser = async (formData) => {
  console.log("create",formData); // Debug log untuk memeriksa data
  const status = await adminStore.registerUser(
    formData.username, formData.email, formData.name, formData.role, formData.password
  );
  if (status === 'success') {
    closeModal();
    await fetchUsers(); // Refresh daftar pengguna
  } else {
    console.error('Failed to create user:', status);
  }
};

// Fungsi untuk mengupdate user
const updateUser = async (formData) => {
  console.log(formData); // Debug log untuk memeriksa data
  const status = await adminStore.modifyUser(
    formData.id, formData.username, formData.email, formData.name, formData.role
  );
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
