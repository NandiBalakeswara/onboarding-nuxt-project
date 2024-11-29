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
        <h1 class="text-2xl font-bold">Booking</h1>
        <p class="mt-1 text-gray-500">All list of booking here</p>
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
            <th class="text-left text-gray-500 font-normal">Number</th>
            <th class="text-left text-gray-500 font-normal">Name</th>
            <th class="text-left text-gray-500 font-normal">Type</th>
            <th class="text-left text-gray-500 font-normal">Description</th>
            <th class="text-left text-gray-500 font-normal">Quantity</th>
            <th class="text-left text-gray-500 font-normal">Ditails</th>
            <th class="text-left text-gray-500 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.ID">
            <td class="px-4 py-2">{{ booking.BookingNumber }}</td>
            <td class="px-4 py-2">{{ booking.BookedUser.name }}</td>
            <td class="px-4 py-2">{{ booking.BookingType.Name }}</td>
            <td class="px-4 py-2">{{ booking.Description }}</td>
            <td class="px-4 py-2">{{ booking.Qty }}</td>
            <td class="px-4 py-2">
              <ul>
                <li
                  v-for="(detail, detailIndex) in booking.bookingDetails"
                  :key="detail.ID"
                >
                  {{ detail.Product.Name }} - Qty: {{ detail.Qty }} - Total: Rp {{ formatCurrency(detail.Total) }}
                </li>
              </ul>
            </td>
            <td class="px-4 py-2">
              <button @click="openEditModal(booking)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button @click="deleteBooking(booking.ID)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Modal Add/Edit User -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-5 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Booking' : 'Add Booking' }}</h2>
        <form @submit.prevent="isEdit ? updateBooking() : createBooking()">
          <div v-if="!isEdit" class="mb-4">
            <label class="block text-gray-700 mb-2">Booking Type</label>
            <select v-model="bookingsForm.BookingTypeID" class="w-full p-2 border rounded" required>
              <option value="" disabled>Select Booking Type</option>
              <option
                v-for="booktype in booktypelist"
                :key="booktype.ID"
                :value="booktype.ID"
              >
                {{ booktype.Name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <input
              v-model="bookingsForm.Description"
              type="text"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="block text-gray-700 mb-2">Details</label>
            <div
              v-for="product in productlist"
              :key="product.ID"
              class="flex items-center justify-between mb-2"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :value="product.ID"
                  @change="toggleProductSelection(product.ID)"
                  class="w-4 h-4"
                />
                <span>{{ product.Name }}</span>
              </div>
              <input
                :value="getProductQty(product.ID)"
                @input="updateProductQty(product.ID, $event.target.value)"
                type="number"
                min="1"
                class="w-[70%] p-2 border rounded"
                :disabled="!isProductSelected(product.ID)"
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 text-white px-3 py-1 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {{ isEdit ? 'Update Booking' : 'Add Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBookingStore } from '~/stores/staff/bookingStore';
import { useProductStore } from "~/stores/staff/productStore";
import { useBookTypeStore } from "~/stores/staff/book-typeStore";
import { ref, onMounted } from 'vue';

const productlist = ref([]);
const booktypelist = ref([]);
const bookingStore = useBookingStore();
const isModalOpen = ref(false);
const isEdit = ref(false);
const bookings = ref([]);
const bookingsForm = ref({ });

// Format currency
const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Fetch bookings saat komponen di-mount
const fetchBookings = async () => {
  const status = await bookingStore.fetchBookings();
  if (status === 'berhasil mendapatkan data') {
    bookings.value = bookingStore.getBookings;
  } else {
    console.error('Gagal mendapatkan booking:', status);
  }
};

const openAddModal = () => {
 listBookTypes();
 listProduct();
 bookingsForm.value = { BookingTypeID: null, Description: '', bookingDetails: [] };
 isEdit.value = false;
 isModalOpen.value = true;
};
const openEditModal = (booking) => {
 bookingsForm.value = {ID: booking.ID,Description: booking.Description};
 isEdit.value = true;
 isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const createBooking = async () => {
  try {
    const payload = {
      BookingTypeID: bookingsForm.value.BookingTypeID,
      Description: bookingsForm.value.Description,
      bookingDetails: bookingsForm.value.bookingDetails.map((detail) => ({
        ProductID: detail.ProductID,
        Qty: detail.Qty,
      })),
    };
    const status = await bookingStore.addBooking(payload);
    if (status === 'berhasil menyimpan data') {
      showNotification(status, 'success');
      closeModal();
      await fetchBookings();
    } else {
      showNotification(status, 'error');
      closeModal();
    }
  } catch (error) {
    console.error("Kesalahan saat membuat booking:", error);
    showNotification('Gagal membuat booking', 'error');
  }
};
const updateBooking = async () => {
  const status = await bookingStore.modifyBooking(bookingsForm.value.ID, bookingsForm.value.Description);
  if (status === 'berhasil menyimpan data') {
    showNotification(status, 'success');
    closeModal();
    await fetchBookings();
  } else {
    showNotification(status, 'error');
    closeModal();
  }
};
const deleteBooking = async (ID) => {
  const status = await bookingStore.deleteBooking(ID);
  if (status === 'data berhasil dihapus') {
    showNotification(status, 'success');
    await fetchBookings();
  } else {
    showNotification(status, 'error');
  }
};

onMounted(() => {
  fetchBookings();
});
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

const productStore = useProductStore();
const listProduct = async () => {
  const status = await productStore.fetchProduct();
  productlist.value = productStore.getProducts;
};
const bookTypeStore = useBookTypeStore();
const listBookTypes = async () => {
  const status = await bookTypeStore.fetchBookTypes();
  booktypelist.value = bookTypeStore.getBookTypes;
};
// Fungsi untuk memilih atau membatalkan pemilihan product
const toggleProductSelection = (productID) => {
  const index = bookingsForm.value.bookingDetails.findIndex(
    (detail) => detail.ProductID === productID
  );
  if (index === -1) {
    bookingsForm.value.bookingDetails.push({ ProductID: productID, Qty: 1 });
  } else {
    bookingsForm.value.bookingDetails.splice(index, 1);
  }
};

// Fungsi untuk mengecek apakah product telah dipilih
const isProductSelected = (productID) => bookingsForm.value.bookingDetails.some((detail) => detail.ProductID === productID);
// Fungsi untuk mendapatkan jumlah product
const getProductQty = (productID) => {
  const detail = bookingsForm.value.bookingDetails.find(
    (detail) => detail.ProductID === productID
  );
  // Jika produk tidak ditemukan, kembalikan null atau kosong
  return detail ? detail.Qty : null;
};
const updateProductQty = (productID, qty) => {
  const detail = bookingsForm.value.bookingDetails.find(
    (detail) => detail.ProductID === productID
  );
  if (detail) {
    detail.Qty = parseInt(qty) || 1; // Set jumlah minimal 1 jika input kosong atau tidak valid
  }
};
</script>
