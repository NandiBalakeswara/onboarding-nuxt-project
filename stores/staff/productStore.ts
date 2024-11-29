import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore',{
  state: () => ({
    products: [], 
  }),
  
  getters: {
    getProducts(state) {
      return state.products;
    },
  },
  actions: {
    async fetchProduct() {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.get("/staff/product");
        this.products = response.data['data']; // Simpan data book type ke state
        return response.data['status'];
      } catch (error) {
        console.error("Kesalahan saat mengambil book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },

    async addProduct(Name: string, Price: number) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.post("/staff/product", { Name, Price });
        console.log("ini",response.data,response.data['message']);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menambahkan book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
    async updateProduct(ID: string, Name: string, Price: number) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.put(`/staff/product/${ID}`, { Name, Price });
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat memodifikasi book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },  
    async deleteProduct(ID: string) {
      const axiosInstance = useNuxtApp().$axios;
      try {
        const response = await axiosInstance.delete(`/staff/product/${ID}`);
        return response.data['message'];
      } catch (error) {
        console.error("Kesalahan saat menghapus book type:", error.response?.data['message']);
        return error.response?.data['message'];
      }
    },
  }
})
