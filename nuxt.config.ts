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
    modules: ['@unocss/nuxt', '@nuxtjs/supabase', 'nuxt-icon'],
})