<script setup lang="ts">
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'

const app = useState<App | null>('useStateApp', () => null)
const functions = useState<AppFunction[]>('useStateFunctions', () => [])
const route = useRoute()

watch(
    route,
    async ({ params }) => {
        if (!params.appid) return
        if (app.value && app.value.id === params.appid) return

        const [{ data: appdata }, { data: functionsdata }] = await Promise.all([
            useFetch<App>(() => `/api/apps/${params.appid}`, {
                method: 'POST',
            }),

            useFetch<AppFunction[]>(() => `/api/functions`, {
                method: 'POST',
                body: {
                    id: params.id,
                },
            }),
        ])

        if (!appdata.value) return useRouter().push('/dashboard')

        app.value = appdata.value
        functions.value = functionsdata.value || []
    },
    { immediate: true }
)
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="p-4 sm:px-8 sm:pt-8 bg-white">
            <div class="max-w-5xl mx-auto flex justify-between items-center">
                <nuxt-link
                    to="/dashboard"
                    class="h-10 flex gap-3 items-center text-dark-800"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-1/2 <sm:hidden" />
                </nuxt-link>

                <div class="flex gap-4 items-center">
                    <nuxt-link to="/docs">
                        <a-button> Docs </a-button>
                    </nuxt-link>

                    <nuxt-link to="/account">
                        <a-button type="bordered"> Account </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>

        <tabs
            :tabs="[
                {
                    name: 'functions',
                    icon: 'fluent:math-formula-20-regular',
                    url: 'functions',
                },
                {
                    name: 'code',
                    icon: 'file-icons:lua',
                    url: 'code',
                },
                {
                    name: 'insights',
                    icon: 'fluent:arrow-trending-lines-20-regular',
                    url: 'insights',
                },
                {
                    name: 'settings',
                    icon: 'fluent:settings-20-regular',
                    url: 'settings',
                },
            ]"
            :tab="route.path.split('/')[4]"
            :path="route.path.split('/').slice(0, 4).join('/')"
        />

        <main class="flex-grow">
            <slot />
        </main>

        <Footer />
    </div>
</template>
