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
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
      <div class="w-[50%] max-w-md bg-white p-8 rounded drop-shadow-lg">
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
                v-model="formData.name"
                class="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
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
              v-model="formData.username"
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
              v-model="formData.password"
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth-middleware',
});
import { ref } from 'vue';

const isLogin = ref(true); // Mengatur apakah form login atau register
const formData = ref({
  name: '',
  email: '',
  username: '',
  password: '',
});

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  formData.value = {
    name: '',
    email: '',
    username: '',
    password: '',
  };
};

const submitForm = () => {
  if (isLogin.value) {
    // Logika login
    console.log('Login:', formData.value);
  } else {
    // Logika register
    console.log('Register:', formData.value);
  }
};
</script>

<style scoped>
/* Anda bisa menambahkan style tambahan jika diperlukan */
</style>
