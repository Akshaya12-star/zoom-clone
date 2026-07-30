import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqsGwOnaYBT8HLS5VF2o_MX1bwuZ0iWGY",
  authDomain: "zoom-clone-a7886.firebaseapp.com",
  projectId: "zoom-clone-a7886",
  storageBucket: "zoom-clone-a7886.firebasestorage.app",
  messagingSenderId: "243298049429",
  appId: "1:243298049429:web:9aa60a0aba6612a7372a9c",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);