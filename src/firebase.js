import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { getFirestore } from 'firebase/firestore'

// 🔥 DÁN CONFIG Ở ĐÂY
const firebaseConfig1 = {
  apiKey: 'AIzaSyAVPqEfFOxiiuuBzLfN-5c56TACbG885bA',
  authDomain: 'vuonannhien-cd467.firebaseapp.com',
  projectId: 'vuonannhien-cd467',
  storageBucket: 'vuonannhien-cd467.firebasestorage.app',
  messagingSenderId: '426802284269',
  appId: '1:426802284269:web:b645f01acc74ea0016aee4',
  measurementId: 'G-TS2X1SJWD5',
}

const firebaseConfig = {
  apiKey: 'AIzaSyA352vFWZUHkYuTYmot89lQIPm1ghrQbgI',
  authDomain: 'qlbh-487ae.firebaseapp.com',
  projectId: 'qlbh-487ae',
  storageBucket: 'qlbh-487ae.firebasestorage.app',
  messagingSenderId: '227132696328',
  appId: '1:227132696328:web:28a3facffc568a07a4eebd',
  measurementId: 'G-0KHPDM85LQ',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)
