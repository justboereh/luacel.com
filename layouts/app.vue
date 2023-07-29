<script setup lang="ts">
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'

const router = useRouter()
const route = useRoute()
const { data: app } = useFetch<App>(() => `/api/apps/${route.params.appid}`, {
    method: 'POST',
    watch: [route],
})
const { data: functions } = useFetch<AppFunction[]>(
    () => `/api/apps/${route.params.appid}/functions`,
    {
        method: 'POST',
        watch: [route],
    }
)

useState<App | null>('useStateApp', () => app)
useState<AppFunction[] | null>('useStateFunctions', () => functions)

watch(app, (a) => {
    if (a) return

    router.push('/dashboardd')
})
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="p-4 sm:px-8 sm:pt-8 backdrop-blur">
            <div class="max-w-5xl mx-auto flex justify-between items-center">
                <nuxt-link
                    to="/dashboard"
                    class="h-10 flex gap-3 items-center text-dark-800"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-1/2 <sm:hidden" />
                </nuxt-link>

                <div class="flex items-center">
                    <nuxt-link to="/docs">
                        <a-button type="text"> Docs </a-button>
                    </nuxt-link>

                    <nuxt-link to="/account">
                        <a-button type="text"> Account </a-button>
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
