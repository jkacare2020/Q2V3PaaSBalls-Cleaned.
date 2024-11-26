<template>
  <q-layout view="hHh lpR lFf">
    <q-header :elevated="useLightOrDark(true, false)">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="absolute-center">
            <div class="toolbar-title-text">
              <q-icon name="savings" />
              PaaS-Balls
            </div>
          </div>
        </q-toolbar-title>

        <!-- Avatar and dropdown -->
        <q-btn flat round @click="toggleDropdown" v-if="user" class="q-ml-md">
          <q-avatar>
            <img :src="userAvatar || 'default-avatar.png'" />
          </q-avatar>
        </q-btn>
        <q-menu v-model="dropdownOpen">
          <q-list>
            <q-item clickable @click="goToProfile">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="250"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header>Navigation</q-item-label>

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          :title="link.title"
          :icon="link.icon"
          :link="link.link"
          @closeDrawer="leftDrawerOpen = false"
        />

        <q-item
          v-if="$q.platform.is.electron"
          @click="quitApp"
          clickable
          class="text-white absolute-bottom"
          tag="a"
        >
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Quit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useStoreEntries } from "src/stores/storeEntries";
import { useStoreAuth } from "src/stores/storeAuth"; // Import your auth store
import { useLightOrDark } from "src/use/useLightOrDark";
import NavLink from "components/Nav/NavLink.vue";
const userAvatar = ref("src/assets/avatar.jpg");
const $q = useQuasar();
const storeAuth = useStoreAuth(); // Use auth store
const user = computed(() => storeAuth.user); // Reactive user data
const showUserMenu = ref(false);
const storeEntries = useStoreEntries();

const navLinks = [
  { title: "Entries", icon: "savings", link: "/" },
  { title: "Settings", icon: "settings", link: "/settings" },
  { title: "Login", icon: "login", link: "/login" },
  { title: "Signup", icon: "person_add", link: "/signup" },
];

const leftDrawerOpen = ref(false);
const dropdownOpen = ref(false); // Define this to manage dropdown visibility

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value; // This function toggles the dropdown
}

function quitApp() {
  $q.dialog({
    title: "Confirm",
    message: "Really quit PaaS-Balls?",
    cancel: true,
    persistent: true,
    html: true,
    ok: { label: "Quit", color: "negative", noCaps: true },
    cancel: { color: "primary", noCaps: true },
  }).onOk(() => {
    if ($q.platform.is.electron) ipcRenderer.send("quit-app");
  });
}

function goToProfile() {
  router.push("/profile");
}

function logout() {
  storeAuth.logoutUser(); // Correctly calling logoutUser instead of logout
  $q.notify({ type: "negative", message: "Logged out successfully" });
  dropdownOpen.value = false; // Close the dropdown menu
}
</script>
