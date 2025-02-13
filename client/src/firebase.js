// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-460bc.firebaseapp.com",
  projectId: "mern-blog-460bc",
  storageBucket: "mern-blog-460bc.appspot.com",
  messagingSenderId: "877629244265",
  appId: "1:877629244265:web:1cc778b41aef4496a3b3f8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

/**
 * inside storage rule
 * rules_version = '2';
 *  Craft rules based on data in your Firestore database
 *  allow write: if firestore.get(
 *  databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
 * service firebase.storage {
 * match /b/{bucket}/o {
 *  match /{allPaths=**} {
 *    allow read;
 *   allow write: if
 *   request.resource.size < 2 * 1024 * 1024 &&
 *   request.resource.contentType.matches('image/.*')
 *  }
 * }
 *}
 */
