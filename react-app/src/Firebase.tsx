
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "dish-1337.firebaseapp.com",
  projectId: "dish-1337",
  storageBucket: "dish-1337.appspot.com",
  messagingSenderId: "948853021175",
  appId: import.meta.env.VITE_APP_ID,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);