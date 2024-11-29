import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useBookTypeStore = defineStore('bookTypeStore', {
  state: () => ({
    bookTypes: [], // Menyimpan daftar book type
  }),
  
  getters: {
    getBookTypes(state) {
      return state.bookTypes;
    },
  },

  actions: {
    async fetchBookTypes() {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.get("/staff/book-type");
        this.bookTypes = response.data['data']; // Simpan data book type ke state
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat mengambil book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },

    async addBookType(Name: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/staff/book-type", { Name });
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menambahkan book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },

    async modifyBookType(ID: string, Name: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.put(`/staff/book-type/${ID}`, { Name });
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat memodifikasi book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },

    async deleteBookType(ID: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.delete(`/staff/book-type/${ID}`);
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menghapus book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
  },
});
