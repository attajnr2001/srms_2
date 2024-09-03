// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEO7ISXhaTa9IpL-HHhK-z1uRvHOAvyhM",
  authDomain: "srms-ec688.firebaseapp.com",
  projectId: "srms-ec688",
  storageBucket: "srms-ec688.appspot.com",
  messagingSenderId: "462480013806",
  appId: "1:462480013806:web:d8ed97f0cf402f958bf6ff",
  measurementId: "G-VK1CH2SET7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
