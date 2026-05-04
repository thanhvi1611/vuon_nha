//ontap.js
import {
  GoogleAuthProvider,
  signInWithCredential,
  linkWithCredential
} from 'firebase/auth'

import { auth } from '@/firebase'

export function initGoogleOneTap() {
  window.google.accounts.id.initialize({
    client_id: '426802284269-jdgumkvos5d8jcbe0jndlk4unn2le8rk.apps.googleusercontent.com',
    callback: handleCredential,
  })

  window.google.accounts.id.prompt()
}

async function handleCredential(response) {
  try {
    const credential =
      GoogleAuthProvider.credential(response.credential)

    const user = auth.currentUser

    // guest user => thử merge
    if (user && user.isAnonymous) {
      try {
        await linkWithCredential(user, credential)
        console.log('✅ Guest upgraded to Google')
        return
      } catch (err) {
        if (err.code !== 'auth/credential-already-in-use') {
          throw err
        }

        console.log('⚠️ Google account đã tồn tại -> login')
      }
    }

    // account đã tồn tại => login
    await signInWithCredential(auth, credential)

    console.log('✅ Login lại thành công')
  } catch (err) {
    console.error('❌ One Tap lỗi:', err)
  }
}