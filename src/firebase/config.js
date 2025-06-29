// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBebYTmwL3vEKVvUR4W2vah3qRNYOG6v1I",
  authDomain: "jpmc-cfg-2d29d.firebaseapp.com",
  projectId: "jpmc-cfg-2d29d",
  storageBucket: "jpmc-cfg-2d29d.firebasestorage.app",
  messagingSenderId: "860282825194",
  appId: "1:860282825194:web:30d9be42ed30fd06956a93",
  measurementId: "G-8JP0V9BCT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
