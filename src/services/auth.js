// src/services/auth.js

import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth'

import { auth } from '@/firebase'

const provider = new GoogleAuthProvider()

provider.setCustomParameters({
  prompt: 'select_account',
})

/* ===================================
   1. HANDLE REDIRECT RESULT
=================================== */
export async function handleRedirectResultLogin() {
  try {
    const result = await getRedirectResult(auth)

    if (result?.user) {
      console.log('✅ Redirect login success:', result.user.uid)
      return result.user
    }

    return null
  } catch (err) {
    console.error('❌ Redirect result lỗi:', err)
    return null
  }
}

/* ===================================
   2. FALLBACK REDIRECT LOGIN
=================================== */

export async function loginWithRedirectGoogle() {
  console.log('🚀 [LOGIN] Redirect start')

  await signInWithRedirect(auth, provider)

  console.log('❗ Dòng này sẽ KHÔNG chạy (do redirect)')
}

/* ===================================
   3. START LOGIN (One Tap trước)
=================================== */
export async function startGoogleLogin() {
  return new Promise((resolve) => {
    // chưa load script google
    if (!window.google?.accounts?.id) {
      resolve(false)
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const credential =
              GoogleAuthProvider.credential(response.credential)

            await signInWithCredential(auth, credential)
  alert(import.meta.env.VITE_GOOGLE_CLIENT_ID)
            console.log('✅ One Tap login success')

            resolve(true)
          } catch (err) {
            console.error('❌ One Tap signin lỗi:', err)
            resolve(false)
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      window.google.accounts.id.prompt((notification) => {
        // user đóng / browser block / skip
        if (
          notification.isNotDisplayed?.() ||
          notification.isSkippedMoment?.() ||
          notification.isDismissedMoment?.()
        ) {
          console.warn('⚠️ One Tap unavailable')
          resolve(false)
        }
      })
    } catch (err) {
      console.error(err)
      resolve(false)
    }
  })
}

/* ===================================
   4. LOGOUT
=================================== */
export async function logoutGoogle() {
  try {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  } catch {}

  await signOut(auth)
}