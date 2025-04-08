import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDkKOevhumFjGWAyuJfArCXYU8Y1WV5kDI",
  authDomain: "beatflowy.firebaseapp.com",
  projectId: "beatflowy",
  storageBucket: "beatflowy.firebasestorage.app",
  messagingSenderId: "606395332458",
  appId: "1:606395332458:android:d86b307a3af1bac48c1713"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth object initialized with the app
export const auth = getAuth(app);
