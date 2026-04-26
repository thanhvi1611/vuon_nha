import {
  signInAnonymously,
  linkWithPopup,
  signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '@/firebase'
import { signInWithRedirect } from 'firebase/auth'


/* =========================
   1. Login anonymous
========================= */
export async function loginAnon() {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
    console.log(auth.currentUser)

  return auth.currentUser

}

/* =========================
   2. Upgrade → Google
========================= */



export async function upgradeToGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    return await linkWithPopup(auth.currentUser, provider)
  } catch (err) {
    if (err.code === 'auth/popup-blocked') {
      console.log('👉 fallback redirect')
      await signInWithRedirect(auth, provider)
    }

    if (err.code === 'auth/credential-already-in-use') {
      return await signInWithPopup(auth, provider)
    }
    throw err
  }
}