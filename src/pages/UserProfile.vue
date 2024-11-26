<template>
  <div>
    <h1>User Profile</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>Name: {{ user.displayName }}</p>
      <p>Email: {{ user.email }}</p>
      <!-- Add other user attributes here -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "src/stores/userStore"; // Adjust path as needed

const loading = ref(true);
const error = ref(null);
const user = ref(null);

const userStore = useUserStore();

onMounted(async () => {
  try {
    const userData = await userStore.getUserData(); // Assumed async method
    user.value = userData;
    loading.value = false;
  } catch (err) {
    error.value = err;
    loading.value = false;
  }
});
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
