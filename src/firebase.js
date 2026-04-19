import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// 🔥 DÁN CONFIG Ở ĐÂY
const firebaseConfig = {
  apiKey: 'AIzaSyDDyRDW87YQ0ryJFxz6fzqug860at2K5R0',
  authDomain: 'vuon-d9e6a.firebaseapp.com',
  projectId: 'vuon-d9e6a',
  storageBucket: 'vuon-d9e6a.firebasestorage.app',
  messagingSenderId: '374287500808',
  appId: '1:374287500808:web:6b7d177cc6adfb8dd533bd',
}

const app = initializeApp(firebaseConfig)

export const messaging = getMessaging(app)
