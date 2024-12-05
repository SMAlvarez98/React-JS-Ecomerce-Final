// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBifHsh4apZQil5fBGzil8mcKIV2_uaEyM",
  authDomain: "reactjs-ecomerce-63375.firebaseapp.com",
  projectId: "reactjs-ecomerce-63375",
  storageBucket: "reactjs-ecomerce-63375.firebasestorage.app",
  messagingSenderId: "929138646506",
  appId: "1:929138646506:web:635ef26ae6d0dd48ada693"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);