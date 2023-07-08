// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'

import { browserSessionPersistence } from 'firebase/auth'

// const app = initializeApp({
//     apiKey: 'AIzaSyAoW0CcyV9CIFuBkbvZBTatqHS9EXCnTRE',
//     authDomain: 'luacel-387616.firebaseapp.com',
//     projectId: 'luacel-387616',
//     storageBucket: 'luacel-387616.appspot.com',
//     messagingSenderId: '698413813671',
//     appId: '1:698413813671:web:137b122c41f2cf4e75f082',
//     measurementId: 'G-3D3HJVMZV7',
// })

// const auth = getAuth(app)

// export const useFirebaseApp = () => app
// export const useAuth = () => auth

// export const useCurrentUser = function () {
//     const user = ref(auth.currentUser)
//     const session = useCookie('__session')

//     auth.onAuthStateChanged((u) => (user.value = u))

//     if (!session.value || user.value) return user

//     while (user.value === null) {
//         console.log('hi', user.value)
//     }

//     return user
// }

export const setPersistence = () => {
    useFirebaseAuth()?.setPersistence(browserSessionPersistence)
}

export const GetUserToken = async () => {
    try {
        return await (await getCurrentUser()).getIdToken()
    } catch (error: any) {
        return
    }
}
