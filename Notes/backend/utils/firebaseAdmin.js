import admin from "firebase-admin"

// Lightweight init using just projectId (no service account file needed for ID token verification)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

export default admin