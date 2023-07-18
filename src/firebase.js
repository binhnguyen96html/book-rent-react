// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtL_QiNFRBHjnYAahq9m-Qm7996lrfINs",
  authDomain: "book-rent-react-330b1.firebaseapp.com",
  projectId: "book-rent-react-330b1",
  storageBucket: "book-rent-react-330b1.appspot.com",
  messagingSenderId: "855587233717",
  appId: "1:855587233717:web:6386c8afb083d11a24c3fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();