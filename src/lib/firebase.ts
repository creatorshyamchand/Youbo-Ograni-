import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCDLm3jHl2GuOSn9ECU1foGsoCVYV_WxAY",
  projectId: "n3xxon",
  storageBucket: "n3xxon.firebasestorage.app",
  messagingSenderId: "321104594485",
  appId: "1:321104594485:web:d5a202b27f22b4a544537c"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
