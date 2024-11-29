import { defineStore } from 'pinia'

export const useBookingStore = defineStore('bookingStore', {
  state: () => ({
    bookings: [], // Menyimpan daftar booking
  }),
  getters: {
    getBookings(state) {
      return state.bookings;
    },
  },
  actions: {
    async fetchBookings() {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.get("/staff/booking");
        this.bookings = response.data['data']; // Simpan data booking ke state
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat mengambil booking:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
    async addBooking(payload) {
      console.log("hi",payload);
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/staff/booking", payload);
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menambahkan booking:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },    
    async modifyBooking(ID: string, Description: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.put(`/staff/booking/${ID}`, { Description });
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat memodifikasi booking:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
    async deleteBooking(ID: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.delete(`/staff/booking/${ID}`);
        console.log(response.data);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menghapus booking:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
  },
})