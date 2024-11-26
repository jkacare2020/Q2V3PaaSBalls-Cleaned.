import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { db, auth } from "../firebase/init"; // Adjust the import path as necessary
import { doc, setDoc } from "firebase/firestore";

export const useStoreAuth = defineStore("storeAuth", {
  state: () => ({
    user: null,
  }),
  actions: {
    async init() {
      const auth = getAuth();
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
          console.log("User is logged in:", user); // Log the user object to the console
        } else {
          this.user = null;
          console.log("No user is logged in."); // Notify when no user is logged in
        }
      });
    },
    async loginUser({ email, password }) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
      } catch (error) {
        throw new Error("Failed to login: " + error.message);
      }
    },

    //-------------------------------Logout----------------
    logoutUser() {
      signOut(auth)
        .then(() => {
          // console.log('User signed out')
        })
        .catch((error) => {
          // console.log(error.message)
        });
    },
    //-------------------------------Signup-------------------------
    async registerUser(credentials, additionalUserInfo) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${additionalUserInfo.firstName} ${additionalUserInfo.lastName}`,
        });

        const userRef = doc(db, "users", user.uid);
        const registrationDate = new Date();
        const trialPeriodDays = 10;
        const trialEndDate = new Date(
          registrationDate.getTime() + trialPeriodDays * 24 * 60 * 60 * 1000
        );

        await setDoc(userRef, {
          ...additionalUserInfo,
          role: "user",
          registrationDate: registrationDate,
          trialEndDate: trialEndDate,
        });

        return true; // Indicate successful registration
      } catch (error) {
        console.error("Registration error:", error.message);
        throw error; // Rethrow the error to be handled in component
      }
    },
  },
});
