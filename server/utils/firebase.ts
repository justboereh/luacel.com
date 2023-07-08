import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

export const app = initializeApp({
    credential: cert('./firebase-admin.json'),
})

export const auth = getAuth(app)
