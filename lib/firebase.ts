// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2Zd5j3Qd8cuEnT13dGz1lkPTuGXr-L8Y",
  authDomain: "aceai-2f122.firebaseapp.com",
  projectId: "aceai-2f122",
  storageBucket: "aceai-2f122.appspot.com",
  messagingSenderId: "100464983830",
  appId: "1:100464983830:web:66bac832a301cdf6cc9a37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 