<template>
  <div class="px-10">
    <!-- Komponen Alert -->
    <Alert
      class="fixed top-[15%] right-[30%] "
      v-if="showAlert"
      :message="alertMessage"
      :type="alertType"
    />
    <div class="flex items-center justify-between gap-5 mb-3">
      <div>
        <h1 class="text-2xl font-bold">Product</h1>
        <p class="mt-1 text-gray-500">Manage product here</p>
      </div>
      <!-- Tombol untuk menampilkan popup form add user -->
      <button class="bg-blue-500 rounded px-3 py-1 text-gray-50" @click="openAddModal">Add</button>
    </div>
    <hr class="mb-7 mt-1" />
    
    <!-- Tabel user -->
    <div class="mt-5">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left text-gray-500 font-normal">Id</th>
            <th class="text-left text-gray-500 font-normal">Name</th>
            <th class="text-left text-gray-500 font-normal">Price</th>
            <th class="text-left text-gray-500 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t">
            <td class="px-4 py-2">{{ product.ID }}</td>
            <td class="px-4 py-2">{{ product.Name }}</td>
            <td class="px-4 py-2">{{ formatCurrency(product.Price) }}</td>
            <td class="px-4 py-2">
              <button @click="openEditModal(product)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button @click="deleteProduct(product.ID)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Modal Add/Edit User -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-5 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Book Type' : 'Add Book Type' }}</h2>
        <form @submit.prevent="isEdit ? updateProduct() : createProduct()">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input v-model="productForm.Name" type="text" class="w-full p-2 border rounded" required />
            <input v-model="productForm.Price" type="number" class="w-full p-2 border rounded" required />
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="bg-gray-500 text-white px-3 py-1 rounded mr-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">{{ isEdit ? 'Update Price' : 'Add Price' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: ['auth-middleware', 'role-middleware'], // Menggunakan middleware roleMiddleware
    requiredRole: 'Staff',          // Role yang dibutuhkan adalah 'admin'
  });

import { useProductStore } from '~/stores/staff/productStore';
import { ref,onMounted } from "vue" ;

const productStore = useProductStore();
const isModalOpen = ref(false);
const isEdit = ref(false);
const products = ref([]);
const productForm = ref({ ID: null, Name: '', Price: 0 });

const fetchProduct = async () => {
  const status = await productStore.fetchProduct();
  if (status == 'success') {
    products.value = productStore.getProducts;
  } else {
    console.error('Failed to fetch product:', status);
  }
};

const openAddModal = () => {
 productForm.value = { ID: null, Name: '', Price: 0 };
 isEdit.value = false;
 isModalOpen.value = true;
};
const openEditModal = (product) => {
 productForm.value = { ...product };
 isEdit.value = true;
 isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const createProduct = async () => {
  const status = await productStore.addProduct(productForm.value.Name, productForm.value.Price);
  if (status === 'berhasil menyimpan data') {
    showNotification(status, 'success');
    closeModal();
    await fetchProduct();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};

const updateProduct = async () => {
  const status = await productStore.updateProduct(productForm.value.ID, productForm.value.Name, productForm.value.Price);
  if (status === 'berhasil menyimpan data') {
    showNotification(status, 'success');
    closeModal();
    await fetchProduct();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};

const deleteProduct = async (ID) => {
  const status = await productStore.deleteProduct(ID);
  if (status === 'berhasil memproses permintaan') {
    showNotification(status, 'success');
    await fetchProduct();
  } else {
    showNotification(status, 'error');
  }
};

onMounted(() => {
 fetchProduct();
});
const formatCurrency = (value) => {
  return `Rp.${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

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

<style>

</style>