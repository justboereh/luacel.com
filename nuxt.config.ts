import { fileURLToPath } from 'url'

export default defineNuxtConfig({
    alias: {
        '#utils': fileURLToPath(new URL('./server/utils', import.meta.url)),
        '#rules': fileURLToPath(
            new URL('./assets/scripts/rules', import.meta.url)
        ),
        '#types': fileURLToPath(
            new URL('./assets/scripts/types', import.meta.url)
        ),
    },
    app: {
        head: {
            htmlAttrs: { class: 'dark' },
        },
    },
    modules: ['@unocss/nuxt', 'nuxt-vuefire', 'nuxt-icon'],
    vuefire: {
        auth: true,
        config: {
            apiKey: 'AIzaSyAoW0CcyV9CIFuBkbvZBTatqHS9EXCnTRE',
            authDomain: 'luacel-387616.firebaseapp.com',
            projectId: 'luacel-387616',
            storageBucket: 'luacel-387616.appspot.com',
            messagingSenderId: '698413813671',
            appId: '1:698413813671:web:137b122c41f2cf4e75f082',
            measurementId: 'G-3D3HJVMZV7',
        },
        admin: {
            serviceAccount: './firebase-admin.json',
        },
    },
})
