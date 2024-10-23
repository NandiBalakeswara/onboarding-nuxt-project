import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    users: [], // Menyimpan daftar pengguna
  }),
  
  getters: {
    getUsers(state) {
      return state.users;
    },
    isTokenSet() {
      const token = localStorage.getItem("token")
      return token !== null;
    },
  },

  actions: {
    async fetchUsers() {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.get("/admin/users");
        this.users = response.data['data']; // Simpan data pengguna ke state
        return response.data['status'];
      } catch (error) {
        console.error("Kesalahan saat mengambil pengguna:", error.response.data['message']);
        return error.response.data['message'];
      }
    },

    async registerUser(username, email, name, role, password) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/admin/users", {
          username,
          email,
          name,
          role,
          password,
        });
        console.log(response.data);
        await this.fetchUsers(); // Refresh daftar pengguna
        return response.data['status'];
      } catch (error) {
        console.error("Kesalahan saat mendaftar pengguna:", error.response.data['message']);
        return error.response.data['message'];
      }
    },

    async modifyUser(id, username, email, name, role) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.put(`/admin/users/${id}`, {
          username,
          email,
          name,
          role,
        });
        console.log(response.data);
        await this.fetchUsers(); // Refresh daftar pengguna
        return response.data['status'];
      } catch (error) {
        console.error("Kesalahan saat memodifikasi pengguna:", error.response.data['message']);
        return error.response.data['message'];
      }
    },

    async deleteUser(id) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        console.log(response.data);
        await this.fetchUsers(); // Refresh daftar pengguna
        return response.data['status'];
      } catch (error) {
        console.error("Kesalahan saat menghapus pengguna:", error.response.data['message']);
        return error.response.data['message'];
      }
    },
  },
});
