<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStoreSettings } from "src/stores/storeSettings";
import { useStoreEntries } from "src/stores/storeEntries";
import { useStoreAuth } from "src/stores/storeAuth"; // Ensure the path is correct
defineOptions({
  name: "App",
});

const storeSettings = useStoreSettings(),
  storeEntries = useStoreEntries(),
  storeAuth = useStoreAuth(), // Use the auth store
  $q = useQuasar(),
  router = useRouter();

onMounted(() => {
  storeSettings.loadSettings();
  storeEntries.loadEntries();
  storeAuth.init(); // Initialize authentication

  if ($q.platform.is.electron) {
    ipcRenderer.on("show-settings", () => {
      router.push("/settings");
    });
  }
});

// window.addEventListener('contextmenu', e => {
//   e.preventDefault()
// })
</script>
