import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { getFirestore } from 'firebase/firestore'

// 🔥 DÁN CONFIG Ở ĐÂY
const firebaseConfig = {
  apiKey: 'AIzaSyAVPqEfFOxiiuuBzLfN-5c56TACbG885bA',
  authDomain: 'vuonannhien-cd467.firebaseapp.com',
  projectId: 'vuonannhien-cd467',
  storageBucket: 'vuonannhien-cd467.firebasestorage.app',
  messagingSenderId: '426802284269',
  appId: '1:426802284269:web:b645f01acc74ea0016aee4',
  measurementId: 'G-TS2X1SJWD5',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)
