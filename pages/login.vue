<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Bagian kiri: Gambar random -->
    <div class="w-1/2 hidden md:block">
      <img
        src="~/public/img/hotel_bg5.jpg"
        alt="Random Image"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Bagian kanan: Form login/register -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center md:px-8">
      <div class="w-[80%] md:w-[50%] max-w-md bg-white p-8 rounded drop-shadow-lg">
        <h2 class="text-3xl font-semibold text-center mb-6">
          {{ isLogin ? 'Login' : 'Register' }}
        </h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Register fields (hanya jika isLogin = false) -->
          <div v-if="!isLogin" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium">Name</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
          </div>

          <!-- Username (untuk login dan register) -->
          <div>
            <label for="username" class="block text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="mt-1 p-2 w-full border rounded"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 p-2 w-full border rounded"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {{ isLogin ? 'Login' : 'Register' }}
          </button>

          <p class="text-center mt-4">
            <span v-if="isLogin">Don't have an account?</span>
            <span v-else>Already have an account?</span>
            <a href="#" @click="toggleForm" class="text-blue-500 ml-1">
              {{ isLogin ? 'Register' : 'Login' }}
            </a>
          </p>

          <!-- Pesan error -->
          <div v-if="errorMessage" class="text-red-500 text-center">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "login"
});
import { ref } from 'vue';
import {useAuthStore} from '~/stores/auth/authStore'; // Import store

const authStore = useAuthStore();
const isLogin = ref(true); // Mengatur apakah form login atau register
const name = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const errorMessage = ref(''); // Untuk menyimpan pesan error

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  // Reset input ketika toggle
  name.value = '';
  email.value = '';
  username.value = '';
  password.value = '';
};

const submitForm = async () => {
  errorMessage.value = ''; // Reset error message
  if (isLogin.value) {
    // Logika login
    const result = await authStore.login(username.value, password.value);
    if (result.status == "success login") {
      // Redirect ke halaman utama setelah login
      if (result.role == "Admin") {
        navigateTo('/admin');
      }else if (result.role == "Staff") {
        navigateTo('/staff');
      }else {
        navigateTo('/dummy');
      }
      
    } else {
      errorMessage.value = result.status; // Tampilkan error jika login gagal
      username.value = '';
      password.value = '';
    }
  } else {
    //Logika register
    const result = await authStore.register(name.value, email.value, username.value, password.value);
    if (result !== "success") {
      errorMessage.value = result; // Tampilkan error jika registrasi gagal
    } else {
      // Reset field setelah berhasil registrasi
      toggleForm(); // Kembali ke form login setelah registrasi
    }
  }
};
</script>

<style scoped>
/* Anda bisa menambahkan style tambahan jika diperlukan */
</style>
