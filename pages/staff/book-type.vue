<template>
  <div class="px-10">
     <!-- Komponen Alert -->
     <Alert
      class="fixed top-[15%] right-[30%] "
      v-if="showAlert"
      :message="alertMessage"
      :type="alertType"
    />
    <div class="flex items-center justify-between gap-5">
      <div>
        <h1 class="text-2xl font-bold">Book Types</h1>
        <p class="mt-1 text-gray-500">Manage book-types here</p>
      </div>
      <!-- Tombol untuk menampilkan popup form add book type -->
      <button class="bg-blue-500 rounded px-3 py-1 text-gray-50" @click="openAddModal">Add</button>
    </div>
    <hr class="mb-7 mt-1" />
    
    <!-- Tabel book type -->
    <div class="mt-5">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left text-gray-500 font-normal">Id</th>
            <th class="text-left text-gray-500 font-normal">Name</th>
            <th class="text-left text-gray-500 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookType in bookTypes" :key="bookType.id" class="border-t">
            <td class="px-4 py-2">{{ bookType.ID }}</td>
            <td class="px-4 py-2">{{ bookType.Name }}</td>
            <td class="px-4 py-2">
              <button @click="openEditModal(bookType)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button @click="deleteBookType(bookType.ID)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Modal Add/Edit Book Type -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-5 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Book Type' : 'Add Book Type' }}</h2>
        <form @submit.prevent="isEdit ? updateBookType() : createBookType()">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input v-model="bookTypeForm.Name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="bg-gray-500 text-white px-3 py-1 rounded mr-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">{{ isEdit ? 'Update Book Type' : 'Add Book Type' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth-middleware', 'role-middleware'], // Menggunakan middleware roleMiddleware
    requiredRole: 'Staff',      
  });

import { ref, onMounted } from 'vue';
import { useBookTypeStore } from '~/stores/staff/book-typeStore'; // Import bookTypeStore

// Inisialisasi store
const bookTypeStore = useBookTypeStore();

// State untuk mengelola modal dan data book type
const isModalOpen = ref(false);
const isEdit = ref(false);
const bookTypes = ref([]);
const bookTypeForm = ref({ ID: null, Name: '' });

// Fetch data book type dari backend
const fetchBookTypes = async () => {
  const status = await bookTypeStore.fetchBookTypes();
  if (status === 'berhasil mendapatkan data') {
    // Update bookTypes hanya jika fetch berhasil
    bookTypes.value = bookTypeStore.getBookTypes;
  } else {
    console.error('Failed to fetch book types:', status);
  }
};

// Membuka modal untuk menambah book type
const openAddModal = () => {
  bookTypeForm.value = { ID: null, Name: '' };
  isEdit.value = false;
  isModalOpen.value = true;
};

// Membuka modal untuk mengedit book type
const openEditModal = (bookType) => {
  bookTypeForm.value = { ...bookType };
  isEdit.value = true;
  isModalOpen.value = true;
};

// Menutup modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Fungsi untuk menambah book type baru
const createBookType = async () => {
  const status = await bookTypeStore.addBookType(bookTypeForm.value.Name);
  if (status === 'berhasil menyimpan data') {
    showNotification(status, 'success');
    closeModal();
    await fetchBookTypes();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};

// Fungsi untuk mengupdate book type
const updateBookType = async () => {
  const status = await bookTypeStore.modifyBookType(bookTypeForm.value.ID, bookTypeForm.value.Name);
  if (status === 'berhasil menyimpan data') {
    showNotification(status, 'success');
    closeModal();
    await fetchBookTypes();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};

// Fungsi untuk menghapus book type
const deleteBookType = async (ID) => {
  const status = await bookTypeStore.deleteBookType(ID);
  if (status === 'berhasil memproses permintaan') {
    showNotification(status, 'success');
    closeModal();
    await fetchBookTypes();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};

// Saat komponen di-mount, fetch data book types
onMounted(() => {
  fetchBookTypes();
});
//alert
const alertMessage = ref('');
const alertType = ref('success');
const showAlert = ref(false);

const showNotification = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000); // Alert akan hilang setelah 3 detik
};
</script>

<style scoped>
/* Tambahkan styling sesuai kebutuhan */
</style>
