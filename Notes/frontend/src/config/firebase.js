import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "notesai-auth.firebaseapp.com",
  projectId: "notesai-auth",
  storageBucket: "notesai-auth.firebasestorage.app",
  messagingSenderId: "948239570956",
  appId: "1:948239570956:web:014fc87766ddf0802c3629"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()