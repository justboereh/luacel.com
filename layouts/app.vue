<script setup lang="ts">
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'
import { watchOnce } from '@vueuse/core'

const stateApp = useState<App | null>('useStateApp', () => null)
const stateFunctions = useState<AppFunction[]>('useStateFunctions', () => [])
const route = useRoute()
const appTab = computed(() => route.path.split('/')[4])
const path = computed(() => route.path.split('/').slice(0, 4).join('/'))

const { data: app } = await useFetch<App>(
    () => `/api/apps/${route.params.appid}`,
    {
        method: 'POST',
    }
)

stateApp.value = app.value

provide('useApp', app)
provide('useAppTab', appTab)
provide('useAppPath', path)
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

        <div class="w-full relative">
            <div
                class="absolute bottom-0 w-screen h-px bg-light-900 bottom-0"
            />

            <div class="max-w-5xl mx-auto flex overflow-x-auto z-10">
                <auth-tab
                    name="functions"
                    icon="fluent:math-formula-20-regular"
                />

                <auth-tab name="code" icon="file-icons:lua" />

                <auth-tab
                    name="insights"
                    icon="fluent:arrow-trending-lines-20-regular"
                />

                <auth-tab name="settings" icon="fluent:settings-20-regular" />
            </div>
        </div>

        <main class="flex-grow">
            <slot />
        </main>

        <Footer />
    </div>
</template>
